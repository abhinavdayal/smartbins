import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {

  constructor() { }
  board: Array<Array<number>>;
  score: number = 15;
  private zeros(dimensions) {
    let array = [];
    for(let i=0; i<dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : this.zeros(dimensions.slice(1)))
    }

    return array;
  }

  ngOnInit(): void {
    this.board = this.zeros([30, 30])
    let i=0;
    for(i=0; i<20; i++) this.board[5][i] = i+1;
    i++;
    for(let j=0; j<10; j++) this.board[5+j+1][19] = ++i;
  }

}
