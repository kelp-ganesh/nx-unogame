import {
  Color,
  IPendingAction,
  PendingActionType,
  Value,
  type IPlayer,
  type IUnoGame,
} from '@unogame/shared-lib';
import { Card } from './card';
import { Deck } from './deck';
import { Player } from './player';

export class UnoGame {
  name: string;
  id: string;
  players: IPlayer[] = [];
  drawPile: Card[] = [];
  discardPile: Card[] = [];
  // from which the player teh game starts
  currentPlayerIndex: number = 0;
  direction: 1 | -1 = 1;
  activeContext: Color;
  pendingAction: IPendingAction;

  //drawn card in the turn which should be equed to false after each turn
  cardDrawn: boolean = false;
  drawnCard: Card | undefined;

  allowChangeContextPlayerIndex: number = -1;
  isEnd: boolean = false;

  constructor(players: IPlayer[], name: string) {
    //in future should be replaced by extenal lib that creates random numbers
    this.id = players[0].userId;
    this.players = players;
    this.direction = 1;
    this.pendingAction = { Type: PendingActionType.NONE, count: 0 };
    this.name = name;

    //deck init
    const deck = new Deck();
    deck.generateCards();
    const cards = deck.shuffle();

    for (let i = 0; i < players.length; i++) {
      players[i].myCards = cards.slice(7 * i, 7 * (i + 1));
      players[i].index = i;
    }

    let lastCardIndex: number = players.length * 7;

    this.discardPile.push(cards[lastCardIndex]);
    this.activeContext = this.discardPile[0].color;
    this.drawPile = cards.slice(lastCardIndex + 1, cards.length);
  }

  show() {
    console.log('discard pile', this.discardPile);
    console.log('draw pile', this.drawPile);
    for (let i = 0; i < this.players.length; i++) {
      console.log('player ' + i + ' myCards:', this.players[i].myCards);
    }
  }

  timeExceeded() {
    this.cardDrawn = false;
    if (this.pendingAction.Type === PendingActionType.DRAW_TWO) {
      for (let i = 0; i < this.pendingAction.count; i++) {
        this.players[this.currentPlayerIndex].myCards.push(
          this.drawPile.pop(),
        );
      }
      this.activeContext = this.discardPile[0].color;
    }
    this.pendingAction = { Type: PendingActionType.NONE, count: 0 };

    this.currentPlayerIndex =
      (((this.currentPlayerIndex + this.direction) % this.players.length) +
        this.players.length) %
      this.players.length;
  }

  isValidMatch(card1: Card, card2: Card) {
    return (
      (this.pendingAction.Type === PendingActionType.DRAW_TWO &&
        card1.value === Value.DRAW_TWO) ||
      card1.color === this.activeContext ||
      card1.value === card2.value ||
      card1.color === Color.WILD
    );
  }

  getFromDrawPile(player: Player) {
    if (player.index === this.currentPlayerIndex && !this.cardDrawn) {
      const card = this.drawPile.pop();
      //pushing drawn card to players myCards card
      player.myCards.push(card);
      this.drawnCard = card;
      this.cardDrawn = true;
      player.isUnoSaid = false;
    } else {
      return 'Not Valid Move';
    }
  }

  skipCardSubmitted(card: Card) {
    //increment of current player by 2
    this.currentPlayerIndex =
      (((this.currentPlayerIndex + this.direction * 2) % this.players.length) +
        this.players.length) %
      this.players.length;
    this.activeContext = card.color;
    this.discardPile.unshift(card);
  }
  reverseCardSubmitted(card: Card) {
    //dir=dir*-1;
    this.direction = (this.direction * -1) as 1 | -1;
    this.currentPlayerIndex =
      (((this.currentPlayerIndex + this.direction) % this.players.length) +
        this.players.length) %
      this.players.length;
    this.discardPile.unshift(card);
    this.activeContext = card.color;
  }
  drawTwoCardSubmitted(card:Card)
  {
     if (this.discardPile[0].value == Value.DRAW_TWO) {
        const initialCount = this.pendingAction.count;
        this.pendingAction = {
          Type: PendingActionType.DRAW_TWO,
          count: initialCount + 2,
        };
      } else {
        this.pendingAction = { Type: PendingActionType.DRAW_TWO, count: 2 };
      }
      this.currentPlayerIndex =
        (((this.currentPlayerIndex + this.direction) % this.players.length) +
          this.players.length) %
        this.players.length;
      //so no one can submit card on previous active context
      this.activeContext = Color.WILD;
      this.discardPile.unshift(card);
  }

   wildCardSubmitted(card:Card)
   {
     //set active context to chosen color
      this.discardPile.unshift(card);
      this.pendingAction = { Type: PendingActionType.NONE, count: 0 };
      this.allowChangeContextPlayerIndex = this.currentPlayerIndex;
   }
   
   wildDrawFourCardSubmitted(card:Card)
   {
     //set active context to chosen color
      this.allowChangeContextPlayerIndex = this.currentPlayerIndex;
      this.discardPile.unshift(card);
      this.pendingAction = { Type: PendingActionType.DRAW_TWO, count: 4 };
   }
  cardSubmitted(card: Card) {
    if (card.value === Value.SKIP) {
      this.skipCardSubmitted(card);
    } else if (card.value === Value.REVERSE) {
      this.reverseCardSubmitted(card);
    } else if (card.value === Value.DRAW_TWO) {
      this.drawTwoCardSubmitted(card);
    } else if (card.value === Value.WILD) {
      this.wildCardSubmitted(card)
    } else if (card.value === Value.WILD_DRAW_FOUR) {
      this.wildDrawFourCardSubmitted(card);
    }
  }

  changeActiveContext(color: Color, player: Player) {
    if (
      (player.index === this.currentPlayerIndex &&
        this.discardPile[0].value === Value.WILD) ||
      this.discardPile[0].value === Value.WILD_DRAW_FOUR
    ) {
      this.activeContext = color;
      this.allowChangeContextPlayerIndex = -1;
      this.discardPile[0].color = color;
    }
    if (this.pendingAction.Type == PendingActionType.NONE) {
      this.currentPlayerIndex =
        (((this.currentPlayerIndex + this.direction) % this.players.length) +
          this.players.length) %
        this.players.length;
    }
    if (this.pendingAction.Type === PendingActionType.DRAW_TWO) {
      this.currentPlayerIndex =
        (((this.currentPlayerIndex + this.direction) % this.players.length) +
          this.players.length) %
        this.players.length;
      this.players[this.currentPlayerIndex].myCards.push(this.drawPile.pop());
      this.players[this.currentPlayerIndex].myCards.push(this.drawPile.pop());
      this.players[this.currentPlayerIndex].myCards.push(this.drawPile.pop());
      this.players[this.currentPlayerIndex].myCards.push(this.drawPile.pop());
      this.currentPlayerIndex =
        (((this.currentPlayerIndex + this.direction) % this.players.length) +
          this.players.length) %
        this.players.length;
      this.pendingAction = { Type: PendingActionType.NONE, count: 0 };
    }
  }

  submitToDiscarded(card: Card, player: Player) {
    this.cardDrawn = false;
    if (player.index === this.currentPlayerIndex) {
      if ((this.cardDrawn && card === this.drawnCard) || !this.cardDrawn) {
        if (this.isValidMatch(card, this.discardPile[0])) {
          player.myCards = player.myCards.filter((c) => c.id != card.id);
          if (player.myCards.length == 0) {
            this.isEnd = true;
          }
          if (
            card.value !== Value.SKIP &&
            card.value !== Value.REVERSE &&
            card.value !== Value.DRAW_TWO &&
            card.value !== Value.WILD &&
            card.value !== Value.WILD_DRAW_FOUR
          ) {
            this.activeContext = card.color;
            this.discardPile.unshift(card);
            this.cardDrawn = false;
            this.drawnCard = undefined;
            this.currentPlayerIndex =
              (((this.currentPlayerIndex + this.direction) %
                this.players.length) +
                this.players.length) %
              this.players.length;
          } else {
            this.cardSubmitted(card);
          }
        }
      } else {
        return 'Not Valid Move';
      }
    }
  }

  checkPendingAction() {
    if (this.pendingAction.Type === PendingActionType.DRAW_TWO) {
      for (let i = 0; i < this.pendingAction.count; i++) {
        this.players[this.currentPlayerIndex].myCards.push(
          this.drawPile.pop(),
        );
      }
      this.pendingAction = { Type: PendingActionType.NONE, count: 0 };
    }
  }
  onChallenge() {
    this.players.forEach((player) => {
      if (player.myCards.length == 1 && !player.isUnoSaid) {
        let card = this.drawPile.pop();

        player.myCards.push(card);
        card = this.drawPile.pop();

        player.myCards.push(card);
      }
    });
  }

  onUno(player: Player) {
    if (player.index == this.currentPlayerIndex && !player.isUnoSaid) {
      player.isUnoSaid = true;
    }
  }
}
