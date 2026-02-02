import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICard, IPlayer } from '@unogame/shared-lib';
import { ILeaderboardData } from '@unogame/shared-lib';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule, Spinner],
  templateUrl: './leaderboard.html',
})
export class LeaderboardComponent implements OnInit {
  leaderboardData = signal<ILeaderboardData[]>([]);
  isLoading = signal<boolean>(false);

  @Input({ required: true }) players!: IPlayer[];

  ngOnInit() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);

    this.processResults();
  }

  private processResults(): void {
    const results = this.players.map((player) => {
      const score = player.myCards.length === 0 ? 0 : calculateHandScore(player.myCards);
      return {
        ...player,
        score: score,
        isWinner: player.myCards.length === 0,
      };
    });
    results.sort((a, b) => a.score - b.score);
    this.leaderboardData.set(results);
  }

  exitGame(): void {
    window.location.href = '/lobby';
  }
}

export function calculateHandScore(hand: ICard[]): number {
  return hand.reduce((total, card) => {
    if (!isNaN(Number(card.value))) {
      return total + card.points;
    }
    return total + card.points;
  }, 0);
}
