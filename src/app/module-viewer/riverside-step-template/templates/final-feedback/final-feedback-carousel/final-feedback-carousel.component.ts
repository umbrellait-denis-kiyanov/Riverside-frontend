import { Component, forwardRef, Input } from '@angular/core';
import { FinalFeedbackComponent } from '../final-feedback.component';
import { TemplateComponent } from '../../template-base.class';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-final-feedback-carousel',
  templateUrl: './final-feedback-carousel.component.html',
  styleUrls: ['./final-feedback-carousel.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => FinalFeedbackCarouselComponent) }]
})
export class FinalFeedbackCarouselComponent extends FinalFeedbackComponent {
  @Input() inputIds;
  @Input() columnBoxes;
  @Input() inputs;
  @Input() data;

  sliderIndex = 0;

  customOptions: OwlOptions = {
    navSpeed: 700,
    items: 1,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
  };

  onSlideChange() {
    window.scrollTo(0, 0);
  }
}
