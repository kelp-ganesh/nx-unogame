import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IWaitingRoom } from '@unogame/shared-lib';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Toast, ReactiveFormsModule],
  templateUrl: './lobby.html',
})
export class LobbyComponent implements OnInit, OnDestroy {
  showCreateModal = signal(false);
  joinedLobby = signal(false);
  userName = signal('user');
  avatarId = signal('1');
  rooms = signal<IWaitingRoom[]>([]);

  private readonly routerLink = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly socketService = inject(SocketService);
  private lobbySub!: Subscription;
  private routeSub!: Subscription;

  ngOnInit() {
    const connect = this.socketService.connect();

    if (!connect) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Auth Failed' });
      setTimeout(() => {
        this.routerLink.navigate(['/signup']);
      }, 1500);
    } else {
      this.fetchLobbyUpdate();
    }
  }

  ngOnDestroy() {
    if (this.lobbySub) {
      this.lobbySub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  fetchLobbyUpdate(): void {
    this.socketService.lobbyInit();
    this.lobbySub = this.socketService.onLobbyUpdate().subscribe({
      next: (data) => {
        const player = data.player;
        if (player) {
          this.joinedLobby.set(player.isReady);
          this.userName.set(player.userName);
          this.avatarId.set(player.avatarId);
        }
        const lobby: IWaitingRoom[] = [];
        for (let i = 0; i < data.lobby.length; i++) {
          const res = data.lobby[i];
          const lb: IWaitingRoom = {
            id: res.id,
            name: res.name,
            maxSize: res.maxSize,
            players: res.players,
          };
          lobby.push(lb);
        }
        this.rooms.set(lobby);
      },
      error: (err) => console.error('Socket error:', err),
    });

    this.routeSub = this.socketService.onRouteToGame().subscribe({
      next: () => {
        this.routerLink.navigate(['/game']);
      }
    });
  }

  toggleModal(): void {
    this.showCreateModal.update((v) => !v);
  }

  onLogout(): void {
    localStorage.removeItem('authToken');
    this.routerLink.navigate(['/']);
    this.socketService.disconnect();
  }

  createRoom(name: string, max: string): void {
    this.socketService.createRoom(name, +max);
    this.joinedLobby.set(true);
    this.toggleModal();
  }

  joinRoom(id: string): void {
    this.socketService.joinRoom(id);
    this.joinedLobby.set(true);
  }
}
