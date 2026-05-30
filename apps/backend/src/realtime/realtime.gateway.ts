import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    const merchantId = client.handshake.query.merchantId;
    if (typeof merchantId === 'string' && merchantId.length > 0) {
      void client.join(`merchant:${merchantId}`);
    }
    this.logger.log(`socket connected ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`socket disconnected ${client.id}`);
  }

  emitToMerchant(merchantId: string, event: string, payload: unknown): void {
    this.server?.to(`merchant:${merchantId}`).emit(event, payload);
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: Socket, @MessageBody() body: unknown): { event: string; data: unknown } {
    return { event: 'pong', data: body ?? null };
  }
}
