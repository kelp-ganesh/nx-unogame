import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

import type {
  IJoinRoom,
  ICreateRoom,
  ISubmitCard,
  IChangeColorContext,
  ILobbyUpdate,
  IJwtPayload,
} from '@unogame/shared-lib';
import { SocketService } from './socket.service';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { UserModel } from '../model/user.model';

interface IAuthenticatedSocket extends Socket {
  user: IJwtPayload;
}

@WebSocketGateway(+process.env.SOCKET_PORT, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    public configService: ConfigService,
    private readonly socketService: SocketService,
  ) {}

  //socket auth logic
  async handleConnection(client: IAuthenticatedSocket) {
    try {
      const token: string = client.handshake.auth?.token as string;
      const payload: IJwtPayload = this.jwt.verify(token);
      client.user = payload;
      const playerInfo: UserModel | null = await this.userService.findUserByEmail(client.user.email);

      const player = this.socketService.addPlayer(
        client.user.userId,
        client.id,
        playerInfo!.dataValues.avatarId as string,
        playerInfo!.dataValues.name as string,
      );
      const lobby = this.socketService.getLobbyState();

      client.emit('lobby-update', { lobby: lobby, player: player });
    } catch {
      this.logger.warn('unauthorized user is trying to hit lobby page');
      client.disconnect();
    }
  }

  handleDisconnect(client: IAuthenticatedSocket) {
    this.socketService.removePlayer(client.id);
  }

  // health check
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.emit('message', {
      text: 'Hello from server',
      received: data,
    });
  }

  //Used to create room
  @SubscribeMessage('create-room')
  onCreateRoom(
    @MessageBody() data: ICreateRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const res: ILobbyUpdate = this.socketService.createLobby(
      client.id,
      data.roomName,
      data.maxSize,
    );
    this.server.emit('lobby-update', { lobby: res.lobby, player: res.player });
  }

  //Used to join room
  @SubscribeMessage('join-room')
  onJoinRoom(
    @MessageBody() data: IJoinRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const res = this.socketService.joinLobby(data.roomId, client.id);
    this.server.emit('lobby-update', { lobby: res.lobby, player: res.player });
    if (res.sockets?.length) {
      res.sockets.forEach((socket) =>
        this.server.to(socket).emit('route-gamePage'),
      );
    }
  }

  //Update should send to all users
  @SubscribeMessage('lobby-init')
  onLobbyInit(@ConnectedSocket() client: Socket) {
    const res = this.socketService.fetchLobbyUpdate(client.id);
    if (res) {
      client.emit('lobby-update', { lobby: res.lobby, player: res.player });
    }
  }

  @SubscribeMessage('submit-card')
  onSubmitToDiscardedPile(
    @MessageBody() data: ISubmitCard,
    @ConnectedSocket() client: Socket,
  ) {
    const res = this.socketService.OnSubmitCard(client.id, data.card);
    res.sockets.forEach((value: string, index: number) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  @SubscribeMessage('draw-card')
  onGetFromDrawnPile(@ConnectedSocket() client: Socket) {
    const res = this.socketService.OnDrawCard(client.id);
    res.sockets.forEach((value: string, index) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  @SubscribeMessage('time-exceeded')
  onSkipTurn(@ConnectedSocket() client: Socket) {
    const res = this.socketService.OnSkipTurn(client.id);
    res.sockets.forEach((value, index) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  @SubscribeMessage('challenge-player')
  onChallenge(@ConnectedSocket() client: Socket) {
    const res = this.socketService.challengePlayer(client.id);
    res.sockets.forEach((value: string, index: number) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  @SubscribeMessage('uno-said')
  onUno(@ConnectedSocket() client: Socket) {
    const res = this.socketService.onUnoSaid(client.id);

    res.sockets.forEach((value: string, index: number) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  //whenever some one lands to game page
  @SubscribeMessage('game-init')
  onGameInit(@ConnectedSocket() client: Socket) {
    const res = this.socketService.onGameInit(client.id);

    res.sockets.forEach((value: string, index: number) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  @SubscribeMessage('change-contextColor')
  onChangeContextColor(
    @MessageBody() data: IChangeColorContext,
    @ConnectedSocket() client: Socket,
  ) {
    const res = this.socketService.onChangeContextColor(client.id, data.color);

    res.sockets.forEach((value, index) => {
      this.server.to(value).emit('game-state', res.gameState[index]);
    });
  }

  @SubscribeMessage('leaderboard-data')
  onGameEnd(@ConnectedSocket() client: Socket) {
    const res = this.socketService.fetchLeaderBoardData(client.id);
    res.sockets.forEach((value: string) => {
      this.server
        .to(value)
        .emit('game-result', { state: res.state, playerId: res.playerId });
    });
    client.emit('game-result', { state: res.state, playerId: res.playerId });
  }
}
