import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ManageRoutingModule } from './manage-routing.module';
import { MapsModule } from "src/app/maps/maps.module"
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';

// this module is for user to manage the bins

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ManageRoutingModule,
    MapsModule,
    AngularMaterialModule,
    FormsModule
  ]
})
export class ManageModule { }
