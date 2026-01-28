import { Component, Input } from '@angular/core';
import { ICard, Value } from '@unogame/shared-lib';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
})
export class CardComponent {
  @Input({ required: true }) card!: ICard;

  isNumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  isSkip(value: Value): boolean {
    return value === Value.SKIP;
  }
  isReverse(value: Value): boolean {
    return value === Value.REVERSE;
  }
  isDrawTwo(value: Value): boolean {
    return value === Value.DRAW_TWO;
  }
  isWild(value: Value): boolean {
    return value === Value.WILD;
  }

  isWildFour(value: Value): boolean {
    return value === Value.WILD_DRAW_FOUR;
  }
}
