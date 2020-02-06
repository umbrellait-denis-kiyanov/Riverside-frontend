import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddCampaignComponent } from './modal-add-campaign/modal-add-campaign.component';
import { Campaign } from '../../../../../common/interfaces/campaign.interface';
import * as moment from 'moment';

@Component({
  selector: 'campaign-calendar',
  templateUrl: './campaign-calendar.component.html',
  styleUrls: ['./campaign-calendar.component.sass']
})
export class CampaignCalendarComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  @ViewChild('tableLabel') tableLabel: ElementRef;
  @Output() campaignsChange: EventEmitter<Campaign[]> = new EventEmitter<Campaign[]>();
  @Input() campaigns: Campaign[];
  months: string[];
  campaignGraphs: { [key: string]: Campaign[] } = {};
  years: string[] = [];

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.months = moment.monthsShort();
    this.splitCampaignsByYear(this.campaigns);
    Object.keys(this.campaignGraphs).forEach(year => this.years.push(year));
  }

  splitCampaignsByYear(campaigns: Campaign[]) {
    campaigns.forEach((campaign: Campaign) => {
      const start = moment(campaign.startDate, 'YYYY-MM-DD');
      const end = moment(campaign.endDate, 'YYYY-MM-DD');
      if (!this.campaignGraphs.hasOwnProperty(start.year())) {
        this.campaignGraphs[start.year()] = [];
      }
      if (start.year() !== end.year()) {
        this.splitCampaignsByYear(this.splitCampaignByYear(campaign));
      } else {
        this.campaignGraphs[start.year()].push(campaign);
      }
    });
  }

  splitCampaignByYear(campaign: Campaign): Campaign[] {
    const lastDayOfFirstYear = moment(campaign.startDate, 'YYYY-MM-DD').endOf('year');
    return [
      {
        ...campaign,
        endDate: lastDayOfFirstYear.format('YYYY-MM-DD'),
      },
      {
        ...campaign,
        startDate: lastDayOfFirstYear.add(1, 'day').format('YYYY-MM-DD'),
      },
    ];
  }

  addCampaign(campaign: Campaign) {
    this.campaigns.push(campaign);
    if (campaign.startDate) {
      this.sortCampaigns();
    }
    this.campaignGraphs = {};
    this.splitCampaignsByYear(this.campaigns);
    this.campaignsChange.emit(this.campaigns);
  }

  openModal() {
    this.modalService
      .open(ModalAddCampaignComponent)
      .result
      .then(this.addCampaign.bind(this));
  }

  sortCampaigns() {
    this.campaigns.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  deleteCampaign(campaign: Campaign) {
    const idx = this.campaigns.indexOf(campaign);
    this.campaigns.splice(idx, 1);
    this.campaignsChange.emit(this.campaigns);
  }

  editCampaign(campaign) {
    // TODO
  }

  trackByFn(index: number, item: Campaign) {
    return index + item.theme ;
  }

  getCampaignWidth(campaign: Campaign): number {
    const start = moment(campaign.startDate, 'YYYY-MM-DD');
    const end = moment(campaign.endDate, 'YYYY-MM-DD');
    const diff = end.diff(start, 'day') + 1;
    const monthsCellWidth = this.table.nativeElement.offsetWidth - this.tableLabel.nativeElement.offsetWidth;
    return Math.floor(diff * monthsCellWidth / 365);
  }

  getCampaignOffset(campaign: Campaign): number {
    const offset = 100;
    return this.tableLabel.nativeElement.offsetWidth + offset;
  }
}
