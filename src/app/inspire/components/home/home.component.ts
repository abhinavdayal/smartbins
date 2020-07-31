import { Component, OnInit } from '@angular/core';
import { MatCarouselModule } from '@ngmodule/material-carousel';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slides = [{'image': '../../../../assets/images/image.jpg'},{'image': '../../../../assets/images/image2.jpg'}, {'image': '../../../../assets/images/image2.png'},{'image': '../../../../assets/images/image3.jpg'}];
  constructor() { }

  ngOnInit(): void {
  }

}
