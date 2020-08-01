import { Component, OnInit } from '@angular/core';
import { DetectionService } from '../services/detection.service';
import { take } from 'rxjs/operators';
var _URL = window.URL || window.webkitURL;

@Component({
  selector: 'app-garbage-detector',
  templateUrl: './garbage-detector.component.html',
  styleUrls: ['./garbage-detector.component.scss']
})
export class GarbageDetectorComponent implements OnInit {
  readonly maxSize = 500 * 2 ** 10; //500KB max
  constructor(private detectionService: DetectionService) { }
  uploading = false;
  result: any;
  ngOnInit(): void {
  }

  isvalid(t: string): boolean {
    return t == "image/jpeg" || t == "image/png";
  }

  detect(data: any) {
    console.log(data)
    this.SendForDetection(data);
  }

  onFileChanged(event: any) {
    let f: File = event.target.files[0];
    if (f.size > this.maxSize || !this.isvalid(f.type.toLowerCase())) {
      alert("Only .jpg, .png, .svg image files up to 500KB are allowed")
    } else {
      this.uploading = true;
      let reader = new FileReader();
      reader.onloadend = () => {
        let i = reader.result.toString()
        this.SendForDetection(i);
      }
      reader.onerror = (error) => {
        console.log(error);
      }
      reader.readAsDataURL(f);
    }
  }


  private SendForDetection(i: string) {
    let data = i.substring(i.indexOf(',') + 1);
    this.detectionService.detect(data).pipe(take(1)).subscribe((d) => {
      this.uploading = false;
      this.result = d;
    });
  }
}
