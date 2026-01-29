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
 
}
