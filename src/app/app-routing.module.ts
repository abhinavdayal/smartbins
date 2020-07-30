import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AnonauthGuard } from './auth/guards/anonauth.guard';
import { ScannerComponent } from './scanner/scanner.component';
import { GarbageDetectorComponent } from './garbage-detector/garbage-detector.component';
import { AdminGuard } from './auth/guards/admin.guard';

const routes: Routes = [
  {
    path: 'engage',
    loadChildren: () =>
      import('./engage/engage.module').then((m) => m.EngageModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'manage',
    loadChildren: () =>
      import('./manage/manage.module').then((m) => m.ManageModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./inspire/inspire.module').then((m) => m.InspireModule),
  },
  {
    path: 'scanner',
    component: ScannerComponent,
  },
  {
    path: 'garbagedetector',
    component: GarbageDetectorComponent,
    canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
