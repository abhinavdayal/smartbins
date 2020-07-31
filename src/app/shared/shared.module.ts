import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatedCounterComponent } from './animated-counter/animated-counter.component';
import { CarouselComponent } from './carousel/carousel.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FigurecardComponent } from './figurecard/figurecard.component';

@NgModule({
  declarations: [
    AnimatedCounterComponent,
    CarouselComponent,
    FigurecardComponent,
  ],
  imports: [CommonModule, AngularMaterialModule, FlexLayoutModule],
  exports: [AnimatedCounterComponent, CarouselComponent, FigurecardComponent],
})
export class SharedModule {}
