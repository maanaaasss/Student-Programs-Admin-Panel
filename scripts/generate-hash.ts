import { hashPassword } from '../src/lib/auth/jwt';

async function generateHash() {
  const password = 'admin123';
  const hash = await hashPassword(password);
  console.log('\nGenerated bcrypt hash for "admin123":');
  console.log(hash);
  console.log('\nUse this SQL to update your admin user in Supabase:');
  console.log(`UPDATE admins SET password_hash = '${hash}' WHERE email = 'admin@studentprograms.com';`);
}

generateHash();
