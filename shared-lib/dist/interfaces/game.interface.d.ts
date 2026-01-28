import { Color, Value, PendingActonType } from '../enums/index';
export interface ICard {
    id: string;
    color: Color;
    value: Value;
    points: number;
}
export interface IDeck {
    cards: ICard[];
}
export interface IUnoGame {
    name: string;
    id: string;
    players: IPlayer[];
    drawPile: ICard[];
    discardPile: ICard[];
    currentPlayerIndex: number;
    direction: 1 | -1;
    activeContext: Color;
    pendingAction: {
        pendingActionType: PendingActonType;
        count: number;
    };
    cardDrawn: boolean;
    drawnCard?: ICard;
    allowChangeContextPlayerIndex: number;
    isEnd: boolean;
}
export interface IPlayer {
    userId: string;
    userName: string;
    socketId: string;
    myCards: ICard[];
    isUnoSaid: boolean;
    isReady: boolean;
    index: number;
    gameId: string;
    avatarId: string;
}
export interface IWaitingRoom {
    id: string;
    name: string;
    maxSize: number;
    players: IPlayer[];
}
export interface IOpponent {
    id: string;
    name: string;
    cardCount: number;
    avatarUrl: string;
    isTurn: boolean;
    isUnoSaid: boolean;
}
export interface ILeaderboardData {
    userId: string;
    userName: string;
    socketId: string;
    myCards: ICard[];
    isUnoSaid: boolean;
    isReady: boolean;
    index: number;
    gameId: string;
    avatarId: string;
    score: number;
    isWinner: boolean;
}
