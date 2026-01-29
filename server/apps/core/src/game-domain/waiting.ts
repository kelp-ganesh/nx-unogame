import type { Player } from "./player";

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
}
