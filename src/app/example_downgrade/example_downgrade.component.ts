import { Component } from '@angular/core';

@Component({
  selector: 'test-downgrade',
  templateUrl: './example_downgrade.component.html',
  styleUrls: ['./example_downgrade.component.sass']
})
export class ExampleDowngradeComponent {

  counter: number = 0;

  constructor() {
    console.log('const');
    setInterval(() => {
      this.counter++;
    }, 1000);
  }

  start(): void {
    console.log('starting');
  }

}
