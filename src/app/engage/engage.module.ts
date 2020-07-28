import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngageRoutingModule } from './engage-routing.module';
import { BinUseComponent } from './components/bin-use/bin-use.component';
import { AngularMaterialModule } from '../angular-material.module';

// this module is for user's dashboard, comparitive dashboards and monthly challenges

@NgModule({
  declarations: [BinUseComponent],
  imports: [
    CommonModule,
    EngageRoutingModule,
    AngularMaterialModule
  ]
})
export class EngageModule { }
