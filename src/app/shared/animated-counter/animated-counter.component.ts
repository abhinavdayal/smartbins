import { Component, Input, OnChanges, SimpleChanges, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { timestamp } from 'rxjs/operators';


@Component({
  selector: 'app-animated-counter',
  templateUrl: './animated-counter.component.html',
  styleUrls: ['./animated-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimatedCounterComponent implements OnChanges {

  @Input() duration: number = 1000;
  @Input() count: number;
  @Input() steps: number = 12;
  @Input() suffix: string = '';
  @Input() label: string;
  @Input() footnote: string = '';
  dynamicsize: string;
  
  constructor(private zone:NgZone, private changedetector: ChangeDetectorRef) {
    this.changedetector.detach();
  }

  getsize():string {
    let n = 34 - Math.min(7, this.count.toString().length)*2
    return `${n}pt`
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(!!this.count) {
        let c = this.count;
        this.count = 0;
        let stepindex = 0;
        let stepdur = Math.ceil(this.duration/this.steps);
        let inc = c/this.steps
        let interval = setInterval(() => {
          this.zone.run(()=>{
            this.count = Math.floor(this.count + inc);
            this.dynamicsize = this.getsize();
            stepindex++;
            if(this.count >= c || stepindex == this.steps) {
              this.count = c;
              clearInterval(interval);
            }
            this.changedetector.detectChanges();
          })
        }, stepdur);
      }
      this.changedetector.detectChanges();
  }
}
