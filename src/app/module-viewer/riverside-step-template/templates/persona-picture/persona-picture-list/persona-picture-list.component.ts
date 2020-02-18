import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-persona-picture-list",
  templateUrl: "./persona-picture-list.component.html",
  styleUrls: ["./persona-picture-list.component.sass"]
})
export class PersonaPictureListComponent implements OnInit {
  list = [
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic1.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic2.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic3.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic4.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic5.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic6.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic7.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic8.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic9.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic10.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic11.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic12.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic13.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic14.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic15.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic16.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic17.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic18.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic19.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic20.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic21.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic22.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic23.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic24.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic25.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic26.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic27.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic28.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic29.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic30.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picAna.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picArchie.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picCharlie.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picLynn.jpg",
    "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picTed.jpg"
  ];
  selected: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {}

  select(item: string) {
    this.selected = item;
  }

  done() {
    this.modal.close(this.selected);
  }
}
