import { Component, ElementRef, signal, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { Color, IUnoGame, IGameState } from '@unogame/shared-lib';
import { CardComponent } from '../card/card';
import { LeaderboardComponent } from '../leaderboard/leaderboard';
import type { ICard } from '@unogame/shared-lib';
import { trigger, transition, style, animate } from '@angular/animations';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, CardComponent, LeaderboardComponent, Spinner],
  templateUrl: './game.html',
  styleUrls: ['./game.scss'],
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate(-400px, -300px) scale(0.4) rotate(-20deg)',
        }),
        animate(
          '1000ms cubic-bezier(.25,.8,.25,1)',
          style({
            opacity: 1,
            transform: 'translate(0,0) scale(1) rotate(0)',
          }),
        ),
      ]),

      transition(':leave', [
        animate(
          '400ms ease-in',
          style({
            opacity: 0,
            transform: 'translate({{x}}px, {{y}}px) scale(0.8) rotate(45deg)',
          }),
        ),
      ]),
    ]),
  ],
})
export class GameRoomComponent implements OnInit {
  isLoading = signal<boolean>(false);
  drawnCard = signal<ICard | undefined>(undefined);
  drawnCardHTML = signal<HTMLElement | undefined>(undefined);
  lastDiscardVector = { x: 0, y: 0 };
  gameState = signal<IGameState | undefined>(undefined);
  gameResult = signal<IUnoGame | undefined>(undefined);
  playerId = signal<string>('');
  Color = Color;

  private readonly socketService = inject(SocketService);
  private gameStateSub!: Subscription;
  private gameResultSub!: Subscription;

  @ViewChild('discardPile', { read: ElementRef })
  discardPile!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);
    this.socketService.gameInit();
    this.fetchGameState();
    const connect = this.socketService.connect();
    this.fetchResultState();

    if (!connect) {
      console.log('socket is not connected');
    }
  }

  ngOndestory() {
    if (this.gameStateSub) {
      this.gameStateSub.unsubscribe();
    }
    if (this.gameResultSub) {
      this.gameResultSub.unsubscribe();
    }
  }

  fetchGameState(): void {
    this.gameStateSub = this.socketService.onGameState().subscribe({
      next: (data) => {
        this.gameState.set(data);
        if (this.gameState().isEnd) {
          this.socketService.gameEnds();
        }
      },
      error: () => {
        console.log('error while updating game state');
      },
    });
  }

  fetchResultState(): void {
    this.gameResultSub = this.socketService.onGameResult().subscribe({
      next: (data) => {
        this.gameResult.set(data.state);
        this.playerId.set(data.playerId);
      },
      error: () => {
        console.log('error while updating game result state');
      },
    });
  }

  drawCard(): void {
    if (!this.gameState().isMyTurn) return;
    this.socketService.drawCard();
  }

  playCard(card: ICard, cardEl: HTMLElement): void {
    if (!this.gameState().isMyTurn) return;
    this.drawnCard.set(card);
    this.drawnCardHTML.set(cardEl);
    this.socketService.submitCard(card);
    const discardRect = this.discardPile.nativeElement.getBoundingClientRect();
    const cardRect = this.drawnCardHTML()!.getBoundingClientRect();
    this.lastDiscardVector = {
      x: discardRect.left - cardRect.left,
      y: discardRect.top - cardRect.top,
    };
  }

  callUno(): void {
    if (!this.gameState().isMyTurn) return;
    this.socketService.onUno();
  }

  callSkip(): void {
    if (!this.gameState().isMyTurn) return;
    this.socketService.timeExceed();
  }

  callChallenge(): void {
    this.socketService.onChallenge();
  }

  getColorClass(color: Color): string {
    switch (color) {
      case Color.RED:
        return 'bg-red-600';
      case Color.BLUE:
        return 'bg-blue-600';
      case Color.GREEN:
        return 'bg-green-600';
      case Color.YELLOW:
        return 'bg-yellow-600';
      case Color.WILD:
        return 'bg-slate-800 border-2 border-white';
      default:
        return 'bg-gray-400';
    }
  }

  getOpponentStyle(index: number, total: number) {
    if (total == 1) {
      return {
        transform: `rotate(${90}deg) translate(${-20}vh) rotate(-${90}deg)`,
        left: '48%',
        top: '0%',
        'margin-bottom': '70',
      };
    } else {
      const startAngle = 180;
      const endAngle = 360;
      const step = (endAngle - startAngle) / (total - 1);
      const angle = startAngle + index * step;
      const radius = 45;

      return {
        transform: `rotate(${angle}deg) translate(${radius}vh) rotate(-${angle}deg)`,
        left: '50%',
        top: '60%',
        position: 'absolute',
        'margin-left': '-2rem',
        'margin-top': '-2rem',
      };
    }
  }

  onColorSelect(color: Color): void {
    this.socketService.submitColor(color);
    this.gameState().changeContextColor = false;
    this.gameState().allowChangeContextPlayerIndex = -1;
  }
}
