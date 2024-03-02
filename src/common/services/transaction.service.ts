import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async runTransaction<T>(
    callback: (session: ClientSession, models: Model<any>[]) => Promise<T>,
    model: Model<any>[],
  ): Promise<any> {
    let session: ClientSession | null = null;
    try {
      session = await this.connection.startSession();
      session.startTransaction();
      const result = await callback(session, model);
      await session.commitTransaction();
      return result;
    } catch (error) {
      console.error('Error caught:', error);
      console.log('Rolling back the transaction...');
      if (session) {
        await session.abortTransaction();
        console.log('Transaction rolled back.');
      }
      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }
}

