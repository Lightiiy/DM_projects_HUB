import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MaxCut } from './pages/max-cut/max-cut';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'max-cut', component: MaxCut },
  { path: '**', redirectTo: '' },
];
