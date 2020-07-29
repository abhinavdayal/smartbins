import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngageRoutingModule } from './engage-routing.module';
import { BinUseComponent } from './components/bin-use/bin-use.component';
import { AngularMaterialModule } from '../angular-material.module';
import { BinsNearMeComponent } from './components/bins-near-me/bins-near-me.component';

// this module is for user's dashboard, comparitive dashboards and monthly challenges

@NgModule({
  declarations: [BinUseComponent, BinsNearMeComponent],
  imports: [
    CommonModule,
    EngageRoutingModule,
    AngularMaterialModule
  ]
})
export class EngageModule { }
