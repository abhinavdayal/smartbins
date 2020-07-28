import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { EngageRoutingModule } from './engage-routing.module';
import { BinUseComponent } from './components/bin-use/bin-use.component';

// this module is for user's dashboard, comparitive dashboards and monthly challenges

@NgModule({
  declarations: [HomeComponent, BinUseComponent],
  imports: [
    CommonModule,
    EngageRoutingModule
  ]
})
export class EngageModule { }
