import { Component, OnInit, Input } from '@angular/core';
import { Bin } from 'src/app/data/models';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss']
})
export class BinComponent implements OnInit {

  @Input() bin: Bin;
  
  constructor() { }

  ngOnInit(): void {
  }

}
