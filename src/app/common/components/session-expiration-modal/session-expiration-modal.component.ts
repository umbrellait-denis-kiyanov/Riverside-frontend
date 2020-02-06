import { Component, OnInit , Input } from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-session-expiration-modal',
  templateUrl: './session-expiration-modal.component.html',
  styleUrls: ['./session-expiration-modal.component.sass']
})
export class SessionExpirationModalComponent implements OnInit {

  @Input() timer: Date;
  @Input() modalRef: NgbModalRef;

  constructor(private router: Router) {}// constructor

  ngOnInit() {
    interval(1000).subscribe( (value) => {
      const minutes = this.timer.getMinutes();
      const seconds = this.timer.getSeconds();
      this.timer = new Date(1, 1, 1, 1, minutes , seconds);
      this.timer.setSeconds(seconds - 1);
      if(this.timer.getHours() <= 0) {
        this.modalRef.close(false);
      }// if
    } );
  }// ngOnInit

}
