import { getDb } from './db';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0,1,I,O

export function generateCode(): string {
  const seg = () =>
    Array.from({ length: 4 }, () =>
      CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
    ).join('');
  return `SIED-${seg()}-${seg()}-${seg()}`;
}

export async function lookupCardBySession(stripeSessionId: string) {
  const sql = getDb();
  const [card] = await sql`
    SELECT * FROM gift_cards WHERE stripe_session_id = ${stripeSessionId}
  `;
  return card ?? null;
}

export async function creditCard(cardId: string, amountCents: number, note?: string) {
  const sql = getDb();
  const [card] = await sql`SELECT * FROM gift_cards WHERE id = ${cardId}`;
  if (!card) throw new Error('Card not found');

  const newBalance = card.balance_cents + amountCents;
  await sql`
    UPDATE gift_cards
    SET balance_cents = ${newBalance}, last_activity_at = NOW(), status = 'active'
    WHERE id = ${cardId}
  `;
  await sql`
    INSERT INTO gift_card_transactions
      (card_id, type, amount_cents, balance_after_cents, note)
    VALUES
      (${cardId}, 'credit', ${amountCents}, ${newBalance}, ${note ?? 'Credit applied'})
  `;
  return newBalance;
}

export async function createGiftCard(params: {
  code: string;
  faceValueCents: number;
  purchaserEmail: string;
  recipientName?: string;
  senderName?: string;
  giftMessage?: string;
  stripeSessionId?: string;
}) {
  const sql = getDb();
  const [card] = await sql`
    INSERT INTO gift_cards
      (code, face_value_cents, balance_cents, purchaser_email,
       recipient_name, sender_name, gift_message, stripe_session_id)
    VALUES
      (${params.code}, ${params.faceValueCents}, ${params.faceValueCents},
       ${params.purchaserEmail}, ${params.recipientName ?? null},
       ${params.senderName ?? null}, ${params.giftMessage ?? null},
       ${params.stripeSessionId})
    RETURNING *
  `;
  await sql`
    INSERT INTO gift_card_transactions
      (card_id, type, amount_cents, balance_after_cents, note)
    VALUES
      (${card.id}, 'purchase', ${params.faceValueCents},
       ${params.faceValueCents}, 'Gift card purchased online')
  `;
  return card;
}

export async function lookupCard(code: string) {
  const sql = getDb();
  const [card] = await sql`
    SELECT * FROM gift_cards WHERE code = ${code.toUpperCase().trim()}
  `;
  return card ?? null;
}

export async function chargeCard(
  cardId: string,
  amountCents: number,
  note?: string
) {
  const sql = getDb();

  // Atomic: balance check + subtract in one statement — prevents double-spend race.
  const [updated] = await sql`
    UPDATE gift_cards
    SET
      balance_cents    = balance_cents - ${amountCents},
      last_activity_at = NOW(),
      status           = CASE
                           WHEN balance_cents - ${amountCents} = 0 THEN 'depleted'
                           ELSE 'active'
                         END
    WHERE id = ${cardId}
      AND balance_cents >= ${amountCents}
      AND status = 'active'
    RETURNING id, balance_cents
  `;

  if (!updated) {
    const [card] = await sql`SELECT id FROM gift_cards WHERE id = ${cardId}`;
    throw new Error(card ? 'Insufficient balance' : 'Card not found');
  }

  await sql`
    INSERT INTO gift_card_transactions
      (card_id, type, amount_cents, balance_after_cents, note)
    VALUES
      (${cardId}, 'redemption', ${-amountCents}, ${updated.balance_cents}, ${note ?? null})
  `;
  return updated.balance_cents;
}

export async function applyDormancyFees(): Promise<number> {
  const sql = getDb();
  const DORMANCY_FEE_CENTS = 250; // $2.50/month

  const cards = await sql`
    SELECT * FROM gift_cards
    WHERE status = 'active'
      AND balance_cents > 0
      AND last_activity_at < NOW() - INTERVAL '24 months'
      AND (last_dormancy_fee_at IS NULL OR last_dormancy_fee_at < NOW() - INTERVAL '28 days')
  `;

  for (const card of cards) {
    const fee        = Math.min(DORMANCY_FEE_CENTS, card.balance_cents);
    const newBalance = card.balance_cents - fee;
    const status     = newBalance === 0 ? 'depleted' : 'active';

    await sql`
      UPDATE gift_cards
      SET balance_cents = ${newBalance}, status = ${status}, last_dormancy_fee_at = NOW()
      WHERE id = ${card.id}
    `;
    await sql`
      INSERT INTO gift_card_transactions
        (card_id, type, amount_cents, balance_after_cents, note)
      VALUES
        (${card.id}, 'dormancy_fee', ${-fee}, ${newBalance},
         'Monthly dormancy fee — card inactive 12+ months')
    `;
  }
  return cards.length;
}

export async function getLedgerData() {
  const sql = getDb();

  const [summary] = await sql`
    SELECT
      COUNT(*)                                      AS total_cards,
      COUNT(*) FILTER (WHERE status = 'active')     AS active_cards,
      COUNT(*) FILTER (WHERE status = 'depleted')   AS depleted_cards,
      COALESCE(SUM(face_value_cents), 0)            AS total_issued_cents,
      COALESCE(SUM(balance_cents)
        FILTER (WHERE status = 'active'), 0)        AS outstanding_cents,
      COALESCE(SUM(
        face_value_cents - balance_cents)
        FILTER (WHERE status = 'depleted'), 0)      AS total_redeemed_cents
    FROM gift_cards
  `;

  const cards = await sql`
    SELECT
      gc.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id',                  t.id,
            'type',                t.type,
            'amount_cents',        t.amount_cents,
            'balance_after_cents', t.balance_after_cents,
            'created_at',          t.created_at,
            'note',                t.note
          ) ORDER BY t.created_at DESC
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS transactions
    FROM gift_cards gc
    LEFT JOIN gift_card_transactions t ON t.card_id = gc.id
    GROUP BY gc.id
    ORDER BY gc.purchased_at DESC
  `;

  return { summary, cards };
}
