import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Server } from 'socket.io';
import type { Server } from 'ws';

@WebSocketGateway({
  cors: {
    origin: ['*'],
  },
})
export class AuthenticatorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger(AuthenticatorGateway.name);

  async afterInit(server: any) {
    // throw new Error('Method not implemented.');
    console.log({ server: server });
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log('handleConnection');
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    this.logger.log('handleDisconnect');
    // throw new Error('Method not implemented.');
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
