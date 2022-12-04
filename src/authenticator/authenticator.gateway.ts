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
import { Server } from 'socket.io';
import { Roles } from '@auth/decorators/DiscordRoleDecorator.decorator';
import { ROLES } from '@/constants';
// import type { Server } from 'ws';

@WebSocketGateway({
  cors: {
    origin: ['*'],
  },
})
export class AuthenticatorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: any, ...args: any[]) {
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    // throw new Error('Method not implemented.');
  }
  logger = new Logger(AuthenticatorGateway.name);

  async afterInit(server: any) {
    // throw new Error('Method not implemented.');
    console.log({ server: server });
  }

  @WebSocketServer()
  server: Server;

  // @UseGuards(SessionGuard)

  @Roles([ROLES.MENTOR])
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
