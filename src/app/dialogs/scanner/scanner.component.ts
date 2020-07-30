import { Component, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScannerComponent implements AfterViewInit {
  @ViewChild(QrScannerComponent) qrScannerComponent!: QrScannerComponent;

  constructor(public dialogRef: MatDialogRef<ScannerComponent>, private router: Router) { }

  ngAfterViewInit() {
    setTimeout(() => {
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

      this.qrScannerComponent.capturedQr.subscribe((result: string) => {
        //TODO: parse result url, it should be of format https://smart-bins-vitb.web.app/engage/binuse/secret
        // extract the secret and then 
        let secret = 'EXTRACT THE SECRET'
        this.router.navigate([`/engage/binuse/${secret}`]);
        //window.location.href = result;
        //window.open(result);
        //console.log(result);
        this.close();
      });
    }, 100)
  }

  close() {
    this.dialogRef.close();
  }
}
