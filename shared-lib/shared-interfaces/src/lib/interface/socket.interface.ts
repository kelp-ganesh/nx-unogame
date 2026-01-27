import type { Color, PendingActonType } from '../types/const.types.js';
import type { ICard, IOpponent, IPlayer, IUnoGame, IWaitingRoom } from './game.interface.js';

export interface IJoinRoom {
  roomId: string;
}
export interface ICreateRoom {
  roomName: string;
  maxSize: number;
}



export interface IChangeColorContext {
  color: Color;
}

export interface ILobbyUpdate {
  lobby: IWaitingRoom[];
  player?: IPlayer;
}

export interface IJoinLobby {
  lobby: IWaitingRoom[];
  player?: IPlayer;
  sockets: string[]|undefined;
}

//no need
export interface IROUTE_GAMEPAGE {
  msg: string;
}

export interface IGameResult {
  state: IUnoGame;
  playerId: string;
}

export interface IGameState {
  changeContextColor: boolean;
  allowChangeContextPlayerIndex: number;
  topCard?: ICard;
  roomName: string;
  playerName: string;
  direction: boolean;
  isMyTurn: boolean;
  activeContext: Color;
  myCards: ICard[];
  opponents: IOpponent[];
  isUnoSaid: boolean;
  avatarId: string;
  isEnd: boolean;
}

//submited by player
export interface ISubmitCard {
  card: ICard;
}

export type IDrawCard = {};

//response after submiting card
//no need
// export type END_TURN = {
//   players: PlayerType[];
//   currentPlayerIndex: number;
//   direction: 1 | -1;
//   drawPile: CardType[];
//   discardPile: CardType[];
//   activeContext: string;
//   pendingAction: { Type: "drawTwo" | "none" | "skip"; count: number };
// };

export interface IDrawResponse {
  players: IPlayer[];
  drawPile: ICard[];
  pendingAction: { Type: PendingActonType; count: number };
}

export interface IUpdatedGameState {
  sockets: string[];
  gameState: IGameState[];
}

export interface ILeaderBoardData {
  state: IUnoGame;
  playerId: string;
  sockets: string[];
}
