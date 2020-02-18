import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-session-expiration-modal",
  templateUrl: "./session-expiration-modal.component.html",
  styleUrls: ["./session-expiration-modal.component.sass"]
})
export class SessionExpirationModalComponent implements OnInit, OnDestroy {
  @Input() timer: Date;
  intervalSubject: Subscription;

  constructor(public modalRef: NgbActiveModal) {}

  ngOnInit() {
    this.intervalSubject = interval(1000).subscribe(value => {
      const minutes = this.timer.getMinutes();
      const seconds = this.timer.getSeconds();
      this.timer = new Date(1, 1, 1, 1, minutes, seconds);
      this.timer.setSeconds(seconds - 1);
      if (this.timer.getHours() <= 0) {
        this.intervalSubject.unsubscribe();
        this.modalRef.close(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.intervalSubject.unsubscribe();
  }
}
