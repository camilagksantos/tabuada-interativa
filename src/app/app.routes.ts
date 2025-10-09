import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'game',
        loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
