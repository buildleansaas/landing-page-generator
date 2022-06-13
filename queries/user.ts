import prisma from "lib/api/prisma";

export const getUserByEmail = async (email) => await prisma.user.findUnique({ where: { email } });

export const updateUser = async (email, data) =>
  await prisma.user.update({
    where: {
      email,
    },
    data,
  });
