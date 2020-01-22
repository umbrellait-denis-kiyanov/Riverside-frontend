import { Component, OnInit } from '@angular/core';

@Component({
  host: {
    '(document:click)': 'onClick($event)',
  },
  selector: 'buyer-personas-selector',
  templateUrl: './buyer-personas-selector.component.html',
  styleUrls: ['./buyer-personas-selector.component.sass']
})
export class BuyerPersonasSelectorComponent implements OnInit {

  constructor() { }

  personas = [{ "name": "Sam RcomendationsMake RecommendationsEvaluate SolutionsDefine", "title": "ISSS Director", "picture": "https:\/\/riverside-seagage.s3-us-west-2.amazonaws.com\/Buyer+Personas+images\/pic14.jpg", "index": 1 }, { "name": "Shelby", "title": "Associate Director of XYZ!", "picture": "https:\/\/riverside-seagage.s3-us-west-2.amazonaws.com\/Buyer+Personas+images\/pic5.jpg", "index": 2 }, { "name": "David", "title": "Scholar Advisor", "picture": "https:\/\/riverside-seagage.s3-us-west-2.amazonaws.com\/Buyer+Personas+images\/pic22.jpg", "index": 3 }, { "name": "Patrick!", "title": "ESL Dept Director", "picture": "https:\/\/riverside-seagage.s3-us-west-2.amazonaws.com\/Buyer+Personas+images\/picTed.jpg", "index": 4 }, { "name": "Kristaps Porzi??is!", "title": "Here's a New Guy!!!", "picture": "https:\/\/riverside-seagage.s3-us-west-2.amazonaws.com\/Buyer+Personas+images\/pic3.jpg", "index": 5 }, { "name": "Giannis Ougko Antetokounmpo!", "title": "Forgot About Thisnnnn", "picture": "https:\/\/riverside-seagage.s3-us-west-2.amazonaws.com\/Buyer+Personas+images\/pic4.jpg", "index": 6 }]

  selectBuyerPersona($event) {
    $event.stopPropagation();
  }

  onClick() {
    //close dropdown
  }

  ngOnInit() {
  }

}
