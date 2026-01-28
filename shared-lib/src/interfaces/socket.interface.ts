import type { Color, PendingActionType } from "../enums/index";
import type {
  ICard,
  IOpponent,
  IPlayer,
  IUnoGame,
  IWaitingRoom,
} from "./game.interface";

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
  sockets: string[] | undefined;
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

export interface IPendingAction {
  Type: PendingActionType;
  count: number;
}

export interface IDrawResponse {
  players: IPlayer[];
  drawPile: ICard[];
  pendingAction: IPendingAction;
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
