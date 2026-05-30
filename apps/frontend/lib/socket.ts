import { io, type Socket } from 'socket.io-client';

const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const createMerchantSocket = (merchantId: string): Socket =>
  io(url, {
    transports: ['websocket'],
    query: { merchantId }
  });
