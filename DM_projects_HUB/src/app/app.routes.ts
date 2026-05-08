import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MaxCut } from './pages/max-cut/max-cut';
import { NimGame } from './pages/nim-game/nim-game';
import { AckermannFunction } from './pages/ackermann-function/ackermann-function';
import { StirlingFormula } from './pages/stirling-formula/stirling-formula';

export const routes: Routes = [
  { path: '', component: Home, title: "Home" },
  { path: 'max-cut', component: MaxCut, title: "Max Cut Graph" },
  { path: 'nim-game', component: NimGame, title: "Nim Game" },
  { path: 'ackermann', component: AckermannFunction, title: "Ackermann Function" },
  { path: 'stirling', component: StirlingFormula, title: "Stirling Formula" },
  { path: '**', redirectTo: 'Home' },
];
