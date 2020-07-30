import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScannerComponent implements OnInit {
  @ViewChild(QrScannerComponent, { static: false })
  qrScannerComponent: QrScannerComponent;

  ngOnInit() {}
  ngAfterViewInit() {
    this.qrScannerComponent.getMediaDevices().then((devices) => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe((result) => {
      window.location.href = result;
      //window.open(result);
      console.log(result);
    });
  }
}
