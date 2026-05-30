import { Invoice, Network } from '@prisma/client';
import { BlockchainTransaction, IBlockchainProvider } from './blockchain-provider.interface';

export abstract class MockBlockchainProviderBase implements IBlockchainProvider {
  private readonly watchedAddresses = new Map<string, number>();

  constructor(private readonly network: Network, private readonly confirmationTarget: number) {}

  async watchAddress(address: string): Promise<void> {
    if (!this.watchedAddresses.has(address)) {
      this.watchedAddresses.set(address, 0);
    }
  }

  async getTransaction(address: string): Promise<BlockchainTransaction | null> {
    if (!this.watchedAddresses.has(address)) {
      return null;
    }

    const nextAttempt = (this.watchedAddresses.get(address) ?? 0) + 1;
    this.watchedAddresses.set(address, nextAttempt);

    return {
      txHash: `${this.network.toLowerCase()}_${address}_${nextAttempt}`,
      amount: '100',
      network: this.network,
      confirmations: nextAttempt
    };
  }

  async getBalance(_address: string): Promise<string> {
    return '1000';
  }

  async validatePayment(invoice: Invoice, tx: BlockchainTransaction): Promise<boolean> {
    return invoice.network === tx.network && tx.confirmations >= this.confirmationTarget;
  }
}
