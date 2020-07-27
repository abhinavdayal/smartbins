import {Directive, Input} from '@angular/core'
//https://medium.com/@sub.metu/angular-fallback-for-broken-images-5cd05c470f08
@Directive({
  selector: 'img[default]',
  host: {
    '(error)':'updateUrl()',
    '[src]':'src'
   }
})
export class ImagePreloadDirective {
  @Input() src:string;
  @Input() default:string;

  updateUrl() {
    this.src = this.default;
  }
}