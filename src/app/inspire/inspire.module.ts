import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { InspireRoutingModule } from './inspire-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module'
// This module is to add blogs, information etc. to motivate and educate user

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    InspireRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule,
    SharedModule
  ]
})
export class InspireModule { }
