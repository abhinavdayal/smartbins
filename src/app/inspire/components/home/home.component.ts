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
    {title: 'Events', description:'In events section users can find about the events that are helding across the nation for the purpose of cleanliness and users can find it in events section', icon: 'event', action: 'action'},
    {title: 'Challenges', description:'Monthly challenges will give points to users on completion of it and the points are useful to redemtion to rewards in which user will get money or things ', icon: 'campaign', action: 'action'},
    {title: 'Videos', description:'In this video section user can see the videos related to cleanliness, events occuring near them, and there are videos related to  redeem of points in challenge section.', icon: 'play_circle_filled', action: 'action'},
    {title: 'Analytics', description:'Analytics will show the global information regarding how many people are using smartbins, how many bins are active and what amount of rewards are earned by the users', icon: 'analytics', action: 'action'},
    {title: 'Users ', description:'Users section will be avaliable to the google verified users and in this section user can see the rewards earned by them together with their activity in challenges', icon: 'person', action: 'action'},
    {title: 'Maps', description:'To help users to use smartbins we added maps in which they can see near by bins and they can use them even they show which bin is free and which is filled.', icon: 'maps', action: 'action'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
