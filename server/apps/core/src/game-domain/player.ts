import type { IPlayer ,ICard} from "@unogame/shared-lib";

export class Player {
  userId: string;
  userName: string;
  socketId: string;
  myCards: ICard[];
  isUnoSaid: boolean;
  isReady: boolean;
  index: number;
  gameId: string;
  avatarId: string;

  constructor(
    userid: string,
    username: string,
    socketId: string,
    avatarId: string,
  ) {
    this.userId = userid;
    this.index = 0;
    this.userName = username;
    this.socketId = socketId;
    this.myCards = [];
    this.isUnoSaid = false;
    this.isReady = false;
    this.gameId = "";
    this.avatarId = avatarId;
  }
}
