import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ManageRoutingModule } from './manage-routing.module';
import { MapsModule } from "src/app/maps/maps.module"
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';
import { BinComponent } from './components/bin/bin.component';

// this module is for user to manage the bins

@NgModule({
  declarations: [HomeComponent, BinComponent],
  imports: [
    CommonModule,
    ManageRoutingModule,
    MapsModule,
    AngularMaterialModule,
    FormsModule
  ]
})
export class ManageModule { }
