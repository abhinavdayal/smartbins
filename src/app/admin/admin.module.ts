import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GarbageDetectorComponent } from './garbage-detector/garbage-detector.component';
import { AdminRoutingModule } from './admin-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LivecamComponent } from './livecam/livecam.component';




@NgModule({
  declarations: [GarbageDetectorComponent, LivecamComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ChartsModule,
    AdminRoutingModule,
    HttpClientModule
  ]
})
export class AdminModule { }
