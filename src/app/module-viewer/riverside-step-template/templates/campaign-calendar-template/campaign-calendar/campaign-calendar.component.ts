import { Component, OnChanges, EventEmitter, Output, Input } from '@angular/core';
import { Campaign } from '.';

@Component({
  selector: 'campaign-calendar',
  templateUrl: './campaign-calendar.component.html',
  styleUrls: ['./campaign-calendar.component.sass']
})
export class CampaignCalendarComponent implements OnChanges {

  @Output() campaignsChange = new EventEmitter<Campaign[]>();

  @Input() campaigns: Campaign[];

  constructor() { }

  ngOnChanges() {
    console.log(this.campaigns);
  }

}
