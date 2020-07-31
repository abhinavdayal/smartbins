import { Component, OnInit } from '@angular/core';
import { CarouselContent } from 'src/app/shared/carousel/carousel.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  content = [
    new CarouselContent('/assets/images/image.jpg', "Title1", "desc1", "url1"),
    new CarouselContent('/assets/images/image2.jpg', "Title1", "desc1", "url1"),
    new CarouselContent('/assets/images/image3.jpg', "Title1", "desc1", "url1"),
    new CarouselContent('/assets/images/image4.jpg', "Title1", "desc1", "url1"),
    ]

  cards = [
    {title: 'Events', description:'sdr', icon: 'event', action: 'action'},
    {title: 'Events', description:'sdr', icon: 'campaign', action: 'action'},
    {title: 'Events', description:'sdr', icon: 'close', action: 'action'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
