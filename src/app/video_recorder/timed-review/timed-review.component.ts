import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Source } from './source.interface';
import { HttpClient } from '@angular/common/http';
import { TimedReviewService } from './timed-review.service';
import { Observable, Observer } from 'rxjs';
import { Status } from './status.enum';



@Component({
  selector: 'app-timed-review',
  templateUrl: './timed-review.component.html',
  styleUrls: ['./timed-review.component.sass']
})
export class TimedReviewComponent implements OnInit {

  @Input() prompts: Array<any>;
  @Input() time_limit?: number;
  @Input() pageData: any;
  @Input() time_pause?: number;
  @Input() time_prepare?: number;
  @Input() user: {fname: string, lname: string, id: string};
  @Output() finish: EventEmitter<any> = new EventEmitter();

  status: Status = Status.NOT_STARTED;
  statusEnum: typeof Status = Status;
  sourceId: string;
  sourceData: Source;
  iframe: { url: string };

  constructor(private http: HttpClient, private service: TimedReviewService) { }

  async ngOnInit() {
    if (!this.user || !this.pageData || !this.prompts) {
      return;
    }
    this.sourceData = this.createSourceData();
    this.createSource(this.sourceData)
      .subscribe(sourceId => {
        this.createIframe(sourceId);
        console.log(sourceId);
      },
        _ => {
          this.status = Status.CREATE_SOURCE_ERROR;
        });
  }

  private createSource(sourceData: Source): Observable<string> {
    this.status = Status.CREATE_SOURCE_START;
    return Observable.create((observer: Observer<string>) => {
      this.service.postSource(sourceData)
        .subscribe(data => {
          this.status = Status.CREATE_SOURCE_RESPONSE;
          this.sourceId = data.key;
          observer.next(data.key);
          observer.complete();
        },
          _ => observer.error(_));
    });
  }

  private createSourceData(): Source {
    return {
      postName: this.postName(),
      userid: this.user.id,
      pageid: this.pageData.id,
      classid: this.pageData.classid,
      timeStarted: new Date().toISOString(),
      prompts: this.prompts.map(prompt => {
        return {
          time_limit: prompt.time_limit || this.time_limit,
          time_pause: prompt.time_pause || this.time_pause,
          time_to_prepare: prompt.time_prepare || this.time_prepare,
          prompt: prompt.prompt,
          videoUrl: prompt.videoFile,
          videoThumbnailUrl: prompt.videoThumbnailFile,
          audioUrl: prompt.audioFile,
          type: prompt.type,
          isInformation: prompt.isInformation
        };
      })
    };
  }

  private postName() {
    const today = new Date();
    return [
      this.user.fname,
      this.user.lname,
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getMilliseconds()
    ].join('_');
  }

  private createIframe(sourceId: string): void {
    this.iframe = { url: `/codedo_render/#/?sourceId=${sourceId}` };
    this.status = Status.SOURCE_READY;
  }

  onFinished(): void {
    this.submit();
  }

  private submit(): void {
    const { userid, classid, pageid } = this.sourceData;
    const sourceid = this.sourceId;
    this.status = Status.SUBMIT_START;
    this.service.postSubmit({ userid, classid, pageid, sourceid })
      .subscribe(_ => {
        this.status = Status.SUBMIT_RESPONSE;
        this.finish.emit();
      }
      , _ => { this.status = Status.SUBMIT_ERROR; }
      );
  }

}
