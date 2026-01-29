import { Color, Value, IDeck } from '@unogame/shared-lib';
import { Card } from './card';

export class Deck implements IDeck {
  cards: Card[] = [];
  colors: Color[] = [
    Color.RED,
    Color.BLUE,
    Color.GREEN,
    Color.YELLOW,
    Color.WILD,
  ];

  generateCards(): void {
    //adding 0 value coards
    for (let i = 0; i < 4; i++) {
      const card = new Card(
        this.colors[i]!,
        Value.ZERO,
        0,
        this.colors[i]! + '00',
      );
      this.cards.push(card);
    }

    //adding 1-9 cards
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 4; j++) {
        const card1 = new Card(
          this.colors[j]!,
          String(i) as Value,
          i,
          this.colors[j]! + i + '0',
        );
        this.cards.push(card1);

        const card2 = new Card(
          this.colors[j]!,
          String(i) as Value,
          i,
          this.colors[j]! + i + '1',
        );
        this.cards.push(card2);
      }
    }

    //adding action cards
    for (let i = 0; i < 4; i++) {
      let skip = new Card(
        this.colors[i]!,
        Value.SKIP,
        20,
        this.colors[i]! + 'skip' + '0',
      );
      this.cards.push(skip);
      skip = new Card(
        this.colors[i]!,
        Value.SKIP,
        20,
        this.colors[i]! + 'skip' + '0',
      );
      this.cards.push(skip);

      let reverse = new Card(
        this.colors[i]!,
        Value.REVERSE,
        20,
        this.colors[i]! + 'reverse' + '0',
      );
      this.cards.push(reverse);
      reverse = new Card(
        this.colors[i]!,
        Value.REVERSE,
        20,
        this.colors[i]! + 'reverse' + '1',
      );
      this.cards.push(reverse);

      let plus2 = new Card(
        this.colors[i]!,
        Value.DRAW_TWO,
        20,
        this.colors[i]! + 'draw-two' + '0',
      );
      this.cards.push(plus2);
      plus2 = new Card(
        this.colors[i]!,
        Value.DRAW_TWO,
        20,
        this.colors[i]! + 'draw-two' + '1',
      );
      this.cards.push(plus2);
    }

    //adding wild card
    for (let i = 0; i < 4; i++) {
      let wild = new Card(Color.WILD, Value.WILD, 50, 'WILD' + 'wild' + i);
      this.cards.push(wild);

      let wild4 = new Card(
        Color.WILD,
        Value.WILD_DRAW_FOUR,
        50,
        'WILD' + 'wild-draw-four' + i,
      );
      this.cards.push(wild4);
    }
  }

  shuffle(): Card[] {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let index = Math.floor(Math.random() * i);
      let card = this.cards[index];
      this.cards[index] = this.cards[i]!;
      this.cards[i] = card!;
    }
    return this.cards;
  }
}
