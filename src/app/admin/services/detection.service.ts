import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private readonly detectionurl = 'https://smartbins.jistapi.ml/detect/'
  
  constructor(private http: HttpClient) { }

  detect(image: string):Observable<any> {
    return this.http.post(this.detectionurl, {
      data: image
    });
  }
}
