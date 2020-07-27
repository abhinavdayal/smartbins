import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { InspireRoutingModule } from './inspire-routing.module';

// This module is to add blogs, information etc. to motivate and educate user

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    InspireRoutingModule
  ]
})
export class InspireModule { }
