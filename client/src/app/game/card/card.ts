import { Component, Input } from '@angular/core';
import { ICard, Value } from '@unogame/shared-lib';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
})
export class CardComponent {

  value = Value;
  @Input({ required: true }) card!: ICard;

 numericalCardValuesSet = new Set<Value>([
  Value.ZERO,
  Value.ONE,
  Value.TWO,
  Value.THREE,
  Value.FOUR,
  Value.FIVE,
  Value.SIX,
  Value.SEVEN,
  Value.EIGHT,
  Value.NINE,
]);


  isNumericalCard(value: Value): boolean {
    return this.numericalCardValuesSet.has(value);
  }
}
