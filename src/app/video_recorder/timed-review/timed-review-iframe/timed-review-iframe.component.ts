import {
  Component,
  Input,
  EventEmitter,
  AfterViewInit,
  NgZone,
  OnDestroy,
  Output
} from "@angular/core";

const EVENT_TYPE = "iframe_event";
const EVENTS = {
  END: "end"
};
let alreadyBound = false;

@Component({
  selector: "timed-review-iframe",
  templateUrl: "./timed-review-iframe.component.html",
  styleUrls: ["./timed-review-iframe.component.sass"]
})
export class TimedReviewIframeComponent implements AfterViewInit, OnDestroy {
  @Input() iframe: { url: string };
  @Output() finish: EventEmitter<any> = new EventEmitter();

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    !alreadyBound &&
      this.zone.runOutsideAngular(() => {
        window.addEventListener(
          "message",
          this.handleMessage.bind(this),
          false
        );
        alreadyBound = true;
      });
  }

  ngOnDestroy() {
    window.removeEventListener("message", this.handleMessage.bind(this), false);
    alreadyBound = false;
  }

  handleMessage(event) {
    if (
      event.origin !== window.location.origin ||
      !event.data.type ||
      event.data.type !== EVENT_TYPE
    ) {
      return;
    }
    if (event.data.event === EVENTS.END) {
      this.finish.emit(event.data.data);
    }
  }
}
