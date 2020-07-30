import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AnonauthGuard } from './auth/guards/anonauth.guard';

const routes: Routes = [
  {
    path: 'engage',
    loadChildren: () => import('./engage/engage.module').then(m => m.EngageModule),
    canActivate: [AnonauthGuard],
    canLoad: [AnonauthGuard]
  },
  {
    path: 'manage',
    loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./inspire/inspire.module').then(m => m.InspireModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
