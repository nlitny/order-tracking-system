const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
  const email = 'admin@gmail.com';
  const password = 'password1234';

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Default',
        lastName: 'Admin',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log(`Default admin created: ${email}`);
  } else {
    console.log('Admin already exists, skipping seed.');
  }
}

module.exports = seed;
