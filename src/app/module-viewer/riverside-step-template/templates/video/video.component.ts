import { Component, OnInit, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { VideoTemplateData } from '.';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => VideoComponent) }]
})
export class VideoComponent extends TemplateComponent implements OnInit {
  contentData: VideoTemplateData['template_params_json'];

  videoProvider: 'Vimeo' | 'Youtube';

  embedUrl: string;

  getDescription() {
    return 'Text and video';
  }

  getName() {
    return 'Video';
  }

  hasInputs() {
    return false;
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as VideoTemplateData['template_params_json'];

    const url = this.contentData.videoUrl;
    if (url.indexOf('vimeo.com') > -1) {
      this.videoProvider = 'Vimeo';

      if (url.indexOf('player.vimeo.com') > -1) {
        this.embedUrl = url;
      } else {
        const [id, ] = url.split('.com/').pop().split('/');
        this.embedUrl = 'https://player.vimeo.com/video/' + id + '?portrait=0';
      }
    }
  }
}
