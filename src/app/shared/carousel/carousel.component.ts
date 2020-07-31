import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';

export class CarouselContent {
  backgoundimage: string;
  title: string;
  description: string;
  url: string;

  constructor(img, title, desc, url) {
    this.backgoundimage = img;
    this.title = title;
    this.description = desc;
    this.url = url;
  }
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit, OnDestroy {

  @Input() content: Array<CarouselContent> = [];
  selectedindex = 0;
  currenttime = 0;
  interval: any;
  //progressinterval: any;

  constructor() { }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  ngOnInit(): void {
    this.startAnimation();
  }

  private stopAnimation() {
    if (this.interval)
      clearInterval(this.interval);
    // if (this.progressinterval) clearInterval(this.progressinterval)
  }


  private startAnimation() {
    this.interval = setInterval(() => {
      this.selectedindex++;
      if (this.selectedindex == this.content.length - 1)
        this.selectedindex = 0;
    }, 5000);

    // this.progressinterval = setInterval(() => {
    //   this.currenttime+=0.2;
    //   if (this.currenttime > 100)
    //     this.currenttime = 0;
    // }, 10)
  }
}
