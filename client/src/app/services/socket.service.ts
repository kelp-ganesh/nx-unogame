import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { IGameResult, IGameState, ILobbyUpdate } from '@unogame/shared-lib';
import { ICard } from '@unogame/shared-lib';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly routerLink = inject(Router);
  private readonly socket = inject(Socket);
  private readonly document = inject(DOCUMENT);

  // Helper method to get token from localStorage
  private getTokenFromStorage(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const token = localStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('Error reading auth token from localStorage:', error);
    }
    return null;
  }

  connect(): boolean {
    const token = this.getTokenFromStorage();

    if (token) {
      this.socket.ioSocket.auth = { token };
      this.socket.connect();

      return true;
    } else {
      return true;
    }
  }

  onLobbyUpdate(): Observable<ILobbyUpdate> {
    return this.socket.fromEvent<ILobbyUpdate>('lobby-update');
  }

  onRouteToGame() {
    return this.socket.fromEvent<void>('route-gamePage');
  }

  onGameResult(): Observable<IGameResult> {
    return this.socket.fromEvent<IGameResult>('game-result');
  }

  onGameState(): Observable<IGameState> {
    return this.socket.fromEvent<IGameState>('game-state');
  }

  lobbyInit(): void {
    this.socket.emit('lobby-init');
  }

  joinRoom(roomId: string) {
    this.socket.emit('join-room', { roomId });
  }

  createRoom(roomName: string, maxSize: number) {
    this.socket.emit('create-room', { roomName, maxSize });
  }

  startGame() {
    this.socket.emit('start-game');
  }

  disconnect() {
    this.socket.disconnect();
  }

  submitCard(card: ICard) {
    this.socket.emit('submit-card', { card: card });
  }

  drawCard() {
    this.socket.emit('draw-card', {});
  }

  timeExceed() {
    this.socket.emit('time-exceeded');
  }
  //when user route to /game page game state should be shared

  onChallenge() {
    this.socket.emit('challenge-player');
  }

  onUno() {
    this.socket.emit('uno-said');
  }

  gameInit() {
    this.socket.emit('game-init');
  }

  submitColor(color: string) {
    this.socket.emit('change-contextColor', { color: color });
  }

  gameEnds() {
    this.socket.emit('get-leaderboardData');
  }
}
