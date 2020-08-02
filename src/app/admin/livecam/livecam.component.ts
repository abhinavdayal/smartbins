import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-livecam',
  templateUrl: './livecam.component.html',
  styleUrls: ['./livecam.component.scss']
})
export class LivecamComponent implements OnInit, AfterViewInit {

  @Input() autocapture: number = 0;
  @Input() busy: boolean = false;
  @Output() oncapture:EventEmitter<any> = new EventEmitter<any>()
  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  public captures: Array<any>;

  public constructor() {
      this.captures = [];
  }

  public ngOnInit() { }

  public ngAfterViewInit() {
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
              this.video.nativeElement.srcObject = stream;
              this.video.nativeElement.play();
          });
      }
  }

  public capture() {
      var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
      let dataurl = this.canvas.nativeElement.toDataURL("image/jpeg")
      this.captures.push(dataurl);
      this.oncapture.emit(dataurl)
  }

}
