import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function savePayment(
  paymentId: string,
  userId: string,
  status: string,
  product: string = 'plics-sw',
) {
  await prisma.payment.upsert({
    where: { id: paymentId },
    update: { status, updatedAt: new Date() },
    create: { id: paymentId, userId, status, product },
  });
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status, updatedAt: new Date() },
  });
}

export async function getPayment(paymentId: string) {
  return prisma.payment.findUnique({
    where: { id: paymentId },
  });
}

export async function grantUserAccess(userId: string, paymentId: string) {
  await prisma.userPurchase.create({
    data: { userId, paymentId },
  });
}

export async function getUserPurchases(userId: string) {
  return prisma.userPurchase.findMany({
    where: { userId },
  });
}

export async function saveInstagramFollowersOrder(
  paymentId: string,
  userId: string,
  instagramLink: string,
  quantity: number,
  amount: number,
  testMode: boolean = false,
) {
  await prisma.instagramFollowersOrder.upsert({
    where: { paymentId },
    update: { instagramLink, quantity, amount, updatedAt: new Date() },
    create: { paymentId, userId, instagramLink, quantity, amount, testMode },
  });
}

export async function getInstagramFollowersOrder(paymentId: string) {
  return prisma.instagramFollowersOrder.findUnique({
    where: { paymentId },
  });
}

/** Reivindica atomicamente o pedido para envio ao painel SMM (evita duplo pedido em corrida entre webhook e polling do cliente). */
export async function claimInstagramFollowersOrderForFulfillment(
  paymentId: string,
) {
  const result = await prisma.instagramFollowersOrder.updateMany({
    where: { paymentId, status: 'pending' },
    data: { status: 'processing', updatedAt: new Date() },
  });
  return result.count === 1;
}

export async function markInstagramFollowersOrderSubmitted(
  paymentId: string,
  smmOrderId: string,
) {
  await prisma.instagramFollowersOrder.update({
    where: { paymentId },
    data: {
      status: 'submitted',
      smmOrderId,
      fulfillError: null,
      updatedAt: new Date(),
    },
  });
}

export async function markInstagramFollowersOrderError(
  paymentId: string,
  fulfillError: string,
) {
  await prisma.instagramFollowersOrder.update({
    where: { paymentId },
    data: { status: 'error', fulfillError, updatedAt: new Date() },
  });
}

export async function updateInstagramFollowersOrderSmmStatus(
  paymentId: string,
  smmStatus: string,
) {
  await prisma.instagramFollowersOrder.update({
    where: { paymentId },
    data: { smmStatus, updatedAt: new Date() },
  });
}
