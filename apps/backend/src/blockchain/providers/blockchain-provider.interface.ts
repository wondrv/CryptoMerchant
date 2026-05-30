import { Invoice, Network } from '@prisma/client';

export interface BlockchainTransaction {
  txHash: string;
  amount: string;
  network: Network;
  confirmations: number;
}

export interface IBlockchainProvider {
  getTransaction(address: string): Promise<BlockchainTransaction | null>;
  getBalance(address: string): Promise<string>;
  watchAddress(address: string): Promise<void>;
  validatePayment(invoice: Invoice, tx: BlockchainTransaction): Promise<boolean>;
}
