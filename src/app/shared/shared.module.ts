import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedCounterComponent } from './animated-counter/animated-counter.component';
import { CarouselComponent } from './carousel/carousel.component'
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [AnimatedCounterComponent, CarouselComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  exports: [
    AnimatedCounterComponent,
    CarouselComponent,
  ]
})
export class SharedModule { }
