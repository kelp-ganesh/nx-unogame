import type { Color, PendingActonType } from '../enums/index';
import type { ICard, IOpponent, IPlayer, IUnoGame, IWaitingRoom } from './game.interface';
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
export interface ISubmitCard {
    card: ICard;
}
export type IDrawCard = {};
export interface IDrawResponse {
    players: IPlayer[];
    drawPile: ICard[];
    pendingAction: {
        Type: PendingActonType;
        count: number;
    };
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
