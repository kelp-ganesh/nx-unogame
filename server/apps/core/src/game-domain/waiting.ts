import type { IWaitingRoom } from "@unogame/shared-lib";
import { UnoGame } from "./game.js";
import type { Player } from "./player.js";

export class Waiting {
  id: string;
  name: string;
  players: Player[];
  maxSize: number;

  constructor(socket: string, name: string, creator: Player, maxSize: number) {
    this.id = socket;
    this.name = name;
    creator.isReady = true;
    this.players = [creator];
    this.maxSize = maxSize;
  }

  join_room(player: Player) {
    player.isReady = true;
    this.players.push(player);
  }

  //just for check as actual room is made on gateway
  close_room(socket: string) {
    if (socket === this.id) {
      return true;
    } else {
      return false;
    }
  }
}
