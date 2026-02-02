import type { Color, Value } from '@unogame/shared-lib';

export class Card {
  id: string;
  color: Color;
  value: Value;
  points: number;

  constructor(color: Color, value: Value, points: number, id: string) {
    this.color = color;
    this.value = value;
    this.points = points;
    this.id = id;
  }
}
