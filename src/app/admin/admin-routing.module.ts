import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GarbageDetectorComponent } from './garbage-detector/garbage-detector.component';
import { AdminGuard } from 'src/app/auth/guards/admin.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        //canActivate: [AdminGuard],
    },
    {
        path: 'detector',
        component: GarbageDetectorComponent,
        //canActivate: [AdminGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
