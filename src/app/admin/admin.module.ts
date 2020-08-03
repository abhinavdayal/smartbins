import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GarbageDetectorComponent } from './garbage-detector/garbage-detector.component';
import { AdminRoutingModule } from './admin-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LivecamComponent } from './livecam/livecam.component';
import { HomeComponent } from './home/home.component';




@NgModule({
  declarations: [GarbageDetectorComponent, LivecamComponent, HomeComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    AdminRoutingModule,
    HttpClientModule
  ]
})
export class AdminModule { }
