import { Injectable } from '@nestjs/common';
import {
  Color,
  ICard,
  IGameState,
  IJoinLobby,
  ILeaderBoardData,
  ILobbyUpdate,
  IOpponent,
  IPlayer,
  IUpdatedGameState,
} from '@unogame/shared-lib';
import { Player, UnoGame, Waiting } from '../game-domain';

@Injectable()
export class SocketService {
  activeUsers: Player[] = [];
  Games: UnoGame[] = [];
  Lobby: Waiting[] = [];

  getGameState(client: string): IGameState[] {
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == client),
    );

    const res: IGameState[] = [];
    const opponents: IOpponent[] = [];
    game?.players.forEach((player, index) => {
      const opponent: IOpponent = {
        id: player.userId,
        name: player.userName,
        cardCount: player.myCards.length,
        avatarUrl: player.avatarId,
        isTurn: game.currentPlayerIndex == index,
        isUnoSaid: player.isUnoSaid,
      };

      opponents.push(opponent);
    });
    game?.players.forEach((player, index) => {
      const rightSide = opponents.slice(index + 1);
      const leftSide = opponents.slice(0, index);
      const local: IGameState = {
        direction: game.direction == 1 ? true : false,
        isMyTurn: game.currentPlayerIndex == index,
        activeContext: game.activeContext,
        topCard: game.discardPile[0],
        myCards: player.myCards,
        allowChangeContextPlayerIndex: game.allowChangeContextPlayerIndex,
        changeContextColor: game.allowChangeContextPlayerIndex != -1,
        opponents: [...rightSide, ...leftSide],
        isUnoSaid: player.isUnoSaid,
        roomName: game.name,
        playerName: player.userName,
        avatarId: player.avatarId,
        isEnd: game.isEnd,
      };
      res.push(local);
    });
    return res;
  }

  findSocketIdsByGameId(gameId: string): string[] {
    const game = this.Games.find((game) => game.id === gameId);
    const ans: string[] = [];
    if (game) {
      for (let i = 0; i < game.players.length; i++) {
        ans.push(game.players[i]!.socketId);
      }
    }
    return ans;
  }

  findUserBySocketId(socket: string) {
    return this.activeUsers.find((player) => player.socketId === socket);
  }

  findLobbyByLobbyId(id: string) {
    return this.Lobby.find((lobby) => lobby.id === id);
  }

  addPlayer(
    userId: string,
    clientId: string,
    avatarId: string,
    userName: string,
  ): Player {
    const player: Player = new Player(userId, userName, clientId, avatarId);
    this.activeUsers.push(player);
    return player;
  }

  removePlayer(clientId: string) {
    this.activeUsers = this.activeUsers.filter(
      (player) => player.socketId !== clientId,
    );
  }

  getLobbyState() {
    return this.Lobby;
  }

  createLobby(
    clientId: string,
    lobbyName: string,
    maxSize: number,
  ): ILobbyUpdate {
    const admin = this.findUserBySocketId(clientId);
    if (admin) {
      admin.gameId = clientId;
      const waiting_room = new Waiting(clientId, lobbyName, admin, maxSize);
      this.Lobby.push(waiting_room);
    }
    return { lobby: this.Lobby };
  }

  joinLobby(roomId: string, socketId: string): IJoinLobby {
    const lobby = this.findLobbyByLobbyId(roomId);
    const player: IPlayer | undefined = this.findUserBySocketId(socketId);
    let sockets;
    if (player) {
      player.gameId = roomId;
      lobby?.players.push(player);

      if (lobby && lobby?.maxSize === lobby?.players.length) {
        this.onLobbyFull(lobby);
        const game = this.Games.find((game) =>
          game.players.some((player) => player.socketId == socketId),
        );
        sockets = this.findSocketIdsByGameId(game!.id);
      }
    }

    return { lobby: this.Lobby, sockets };
  }

  onLobbyFull(lobby: Waiting) {
    this.Lobby = this.Lobby.filter((lb) => lb.id != lobby.id);
    const game = new UnoGame(lobby.players, lobby.name);
    this.Games.push(game);
  }

  fetchLobbyUpdate(socketId: string): ILobbyUpdate {
    const player = this.findUserBySocketId(socketId);

    return { lobby: this.Lobby, player: player! };
  }

  OnSubmitCard(socketId: string, card: ICard): IUpdatedGameState {
    const player = this.findUserBySocketId(socketId);
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );

    game!.submitToDiscarded(card, player!);
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);
    return { sockets, gameState };
  }

  OnDrawCard(socketId: string): IUpdatedGameState {
    const player = this.findUserBySocketId(socketId);
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );
    game!.getFromDrawPile(player!);
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);

    return { sockets, gameState };
  }

  OnSkipTurn(socketId: string) {
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );

    game!.timeExceeded();
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);
    return { sockets, gameState };
  }

  challengePlayer(socketId: string) {
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );
    game!.onChallenge();
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);
    return { sockets, gameState };
  }

  onUnoSaid(socketId: string) {
    const player = this.findUserBySocketId(socketId);
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );
    game!.onUno(player!);
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);
    return { sockets, gameState };
  }

  onGameInit(socketId: string) {
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);
    return { sockets, gameState };
  }

  onChangeContextColor(socketId: string, color: Color) {
    const player = this.findUserBySocketId(socketId);
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );
    game!.changeActiveContext(color, player!);
    const gameState: IGameState[] = this.getGameState(socketId);
    const sockets = this.findSocketIdsByGameId(game!.id);
    return { sockets, gameState };
  }

  fetchLeaderBoardData(socketId: string): ILeaderBoardData {
    const player = this.findUserBySocketId(socketId);
    const game = this.Games.find((game) =>
      game.players.some((player) => player.socketId == socketId),
    );

    const sockets = this.findSocketIdsByGameId(game!.id);
    this.Games.filter((g) => g.id == game!.id);
    return { state: game!, playerId: player!.userId!, sockets };
  }
}
