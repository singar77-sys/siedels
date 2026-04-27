// Generate a bcrypt hash for a staff PIN.
// Usage: node scripts/hash-pin.mjs <pin>
// Then paste the output into Neon:
//   INSERT INTO staff (name, pin_hash) VALUES ('Name', '<hash>');
//   UPDATE staff SET pin_hash = '<hash>' WHERE name = 'Name';

import bcrypt from 'bcryptjs';

const pin = process.argv[2];
if (!pin) {
  console.error('Usage: node scripts/hash-pin.mjs <pin>');
  process.exit(1);
}

const hash = await bcrypt.hash(pin, 10);
console.log(hash);
