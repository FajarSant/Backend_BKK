// File: pengguna.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CreatePengguna = async (userData) => {
  try {
    const newUser = await prisma.pengguna.create({
      data: userData,
    });

    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

module.exports = {
  CreatePengguna,
};
