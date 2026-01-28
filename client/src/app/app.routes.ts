import { Routes } from '@angular/router';
import { LandingComponent } from './landingpage/landing';
import { SignupComponent } from './identity/signup/signup';
import { SigninComponent } from './identity/signin/signin';
import { GameRoomComponent } from './game/game-dashboard/game';
import { LobbyComponent } from './lobbypage/lobby';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'game',
    component: GameRoomComponent,
  },
  {
    path: 'lobby',
    component: LobbyComponent,
  },
];
