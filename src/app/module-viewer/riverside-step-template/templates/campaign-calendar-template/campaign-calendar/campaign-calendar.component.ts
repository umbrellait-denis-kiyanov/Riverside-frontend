import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Campaign } from '.';

@Component({
  selector: 'campaign-calendar',
  templateUrl: './campaign-calendar.component.html',
  styleUrls: ['./campaign-calendar.component.sass']
})
export class CampaignCalendarComponent {

  @Output() campaignsChange = new EventEmitter<Campaign[]>();

  @Input() campaigns: Campaign[];

  constructor() { }

  test() {
    this.campaigns.push(this.campaigns.length + 1);
    this.campaignsChange.emit(this.campaigns);
  }

}
