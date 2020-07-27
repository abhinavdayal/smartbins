import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ManageRoutingModule } from './manage-routing.module';

// this module is for user to manage the bins

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
