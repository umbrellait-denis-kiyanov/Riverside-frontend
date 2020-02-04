import { Component, OnInit, OnDestroy, Output, EventEmitter, NgZone, Input } from '@angular/core';
import { RecorderMessageEvent } from './standalone-recorder.interface';

@Component({
  selector: 'standalone-recorder',
  templateUrl: './standalone-recorder.component.html',
  styleUrls: ['./standalone-recorder.component.sass']
})
export class StandaloneRecorderComponent implements OnInit, OnDestroy {
  @Output() finish = new EventEmitter<string>(false);
  @Input() width: string = '325';
  @Input() height: string = '295';

  private standalone_recorder_url = '/codedo_recorder/standalone-recorder';
  private alreadyBound = false;
  private sourceId: string;

  url: string;

  constructor(private zone: NgZone) { }

  ngOnInit() {
    if (!this.alreadyBound) {
      this.zone.runOutsideAngular(() => {
        window.addEventListener('message', this.handleMessage.bind(this), false);
      });
    }

    this.url = this.createStandaloneRecorderIframe();
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      window.removeEventListener('message', this.handleMessage.bind(this), false);
      this.alreadyBound = false;
    });
  }

  private createStandaloneRecorderIframe() {
    this.sourceId = this.getRandomName();
    const recorder_url = this.standalone_recorder_url +
      '/index.html' +
      (this.sourceId ? '?sourceId=' + this.sourceId : '');

    return recorder_url;
  }

  private getRandomName() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  handleMessage(event: RecorderMessageEvent) {
    if (event.data.type === 'iframe_event' && event.data.data.type === 'DONE' && event.data.data.data.sourceId === this.sourceId) {
      this.finish.emit(event.data.data.data.url);
    }
  }
}
