import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { EngageRoutingModule } from './engage-routing.module';
import { BinUseComponent } from './components/bin-use/bin-use.component';
import { AngularMaterialModule } from '../angular-material.module';
import { BinsNearMeComponent } from './components/bins-near-me/bins-near-me.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChallengeComponent } from './components/challenge/challenge.component';

// this module is for user's dashboard, comparitive dashboards and monthly challenges

@NgModule({
  declarations: [BinUseComponent, BinsNearMeComponent, ChallengeComponent],
  imports: [
    CommonModule,
    EngageRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ChartsModule,
  ],
})
export class EngageModule {}
