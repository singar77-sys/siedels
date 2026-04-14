# Siedel's Barbershop — Booksy Data Export
**Exported:** April 13, 2026
**Booksy Business ID:** 1212853

---

## STAFF (9 active)

| Name | Role | Rating | Phone | Email | Booksy ID |
|---|---|---|---|---|---|
| Jim LaMarca | Owner / Master Barber | 5.0 | +1 3309520777 | genesim625@gmail.com | 1154531 |
| Billy Rodriguez | Staffer | 5.0 | +1 2165097033 | billythebarber10@gmail.com | 1175914 |
| Matt Hayes | Staffer | 4.8 | +1 4407852611 | evilfred1981@yahoo.com | 1175917 |
| Patrick Muranko | Staffer | 5.0 | +1 3305911743 | pmuranko7@gmail.com | 1175926 |
| Krista Foecking | Staffer | 4.9 | +1 4405903648 | kristafoecking@yahoo.com | 1175931 |
| Sam (Sickle) | Staffer | 4.9 | +1 3304418857 | sammy.ss452@icloud.com | 1226609 |
| Ticia (Husak) | Staffer | 5.0 | — | laticia3@gmail.com | 1244561 |
| Shannon (Hadick) | Staffer | 4.7 | +1 3302413287 | shannonhadick@gmail.com | 1252931 |
| Pierre (Wright) | Staffer | 5.0 | — | prophetpwright@gmail.com | 1349720 |
| Will (Dillon) | Staffer | 5.0 | +1 3305901453 | barberdad1115@gmail.com | 1592111 |

**NOTE:** Chris Hodge is on the website but NOT in Booksy. He books through Square only.

---

## SERVICES (12 in Booksy)

| Service | Duration | Price | Booksy Service Type |
|---|---|---|---|
| Haircut and Beard Trim | 1h | $42.00 | Haircut & Beard |
| Razor/Foil Fade | 1h | $38.00 | Skin Fade |
| Haircut | 1h | $32.00 | Haircut |
| Duo Haircut | 1h | $64.00 | — |
| Trio Haircut | 1h | $96.00 | — |
| Haircut and Face Shave | 1h | $63.00 | — |
| Beard Trim | 1h | $29.00 | Beard Trim |
| Full Service Shave | 1h | $44.00 | — |
| Head Shave | 1h | $40.00 | — |
| Shoulder Length Cut & Rough Dry | 1h | $38.00 | — |
| Eyebrow, Lip, & Chin | 1h | $23.00 | — |
| Shampoo | — | $5.00 | (add-on, not in Booksy) |
| Shampoo + Style | — | $25.00+ | (not in Booksy) |

### Service-to-Staff Matrix

| Service | Jim | Billy | Matt | Patrick | Krista | Sam | Ticia | Shannon | Pierre | Will |
|---|---|---|---|---|---|---|---|---|---|---|
| Haircut | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Haircut + Beard Trim | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Razor/Foil Fade | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Duo Haircut | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Trio Haircut | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Beard Trim | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Haircut + Face Shave | Y | Y | Y | Y | — | — | — | — | Y | Y |
| Full Service Shave | Y | Y | Y | Y | — | — | — | — | Y | Y |
| Head Shave | Y | Y | Y | Y | — | — | — | — | Y | Y |
| Shoulder Length Cut | — | — | — | — | Y | Y | Y | Y | — | — |
| Eyebrow/Lip/Chin | — | — | — | Y | Y | — | Y | — | — | — |

**Key finding:** "Haircut and Face Shave" ($63) exists in Booksy but NOT on the website.

---

## BILLY RODRIGUEZ — Working Hours (from Booksy)

| Day | Hours |
|---|---|
| Sunday | Not working |
| Monday | 09:00–18:00 (9h) |
| Tuesday | 09:00–18:00 (9h) |
| Wednesday | Not working |
| Thursday | 09:00–17:00 (8h) |
| Friday | 09:00–18:00 (9h) |
| Saturday | 10:00–15:00 (5h) |

(Other staff use the Shifts system, not fixed hours)

---

## APRIL 2026 SNAPSHOT

| Metric | Value |
|---|---|
| Completed appointments | 233 |
| Incomplete | 55 |
| No-shows | 3 |
| Cancelled | 75 |
| Completed revenue | $8,414 |
| Cancellation value | $2,674 |
| New clients | 35 (15%) |
| Returning clients | 191 (85%) |
| Total client list | 2,540 |

### Top Services (April 2026)

| Service | Appointments | Revenue |
|---|---|---|
| Haircut | 168 | $5,376 |
| Haircut and Beard Trim | 38 | $1,596 |
| Duo Haircut | 13 | $832 |
| Razor/Foil Fade | 7 | $266 |
| Beard Trim | 5 | $145 |
| Trio Haircut | 1 | $96 |
| Haircut and Face Shave | 1 | $63 |
| Head Shave | 1 | $40 |

---

## DOWNLOADED FILES

1. `~/Downloads/client_list.xlsx` — 2,540 clients with names, groups, booking count, no-shows, first/last visit, revenue
2. `~/Downloads/appointments_list.xlsx` — April 2026 appointments with date, service, client, staffer, status, revenue

---

## SQUARE MIGRATION NOTES

### What already exists in Square:
- All 11 barbers with individual booking URLs (including Chris Hodge who isn't in Booksy)
- Services are configured in Square Appointments
- Location: LFCOT5CC7MY0S

### What needs to migrate from Booksy → Square:
1. **Client database** (2,540 contacts) — Square supports CSV customer import
2. **"Haircut and Face Shave" service** ($63) — needs to be added to website
3. **Service durations** — Booksy has all services at 1h; website shows more accurate durations (30min, 45min, etc.)
4. **Appointment history** — for reference only, cannot be imported

### Square Customer Import Format (CSV):
```
First Name,Last Name,Email Address,Phone Number,Company Name,Address Line 1,City,State,ZIP,Birthday,Note
```

The `client_list.xlsx` needs to be converted to this format. Many Booksy clients only have phone numbers (no names), and some use Apple Private Relay emails.
