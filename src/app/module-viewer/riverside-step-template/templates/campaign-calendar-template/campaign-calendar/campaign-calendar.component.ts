import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddCampaignComponent } from './modal-add-campaign/modal-add-campaign.component';
import { Campaign, CampaignGraph } from './index';
import * as moment from 'moment';
import { websafeColors } from './websafe-colors';
import { CampaignDeletionConfirmationComponent } from './campaign-deletion-confirmation/campaign-deletion-confirmation';

@Component({
  selector: 'campaign-calendar',
  templateUrl: './campaign-calendar.component.html',
  styleUrls: ['./campaign-calendar.component.sass']
})
export class CampaignCalendarComponent implements OnInit {
  @Input() readonly = false;
  @Output() campaignsChange = new EventEmitter<Campaign[]>();
  @Input() campaigns: Campaign[] = [];
  months: string[];
  campaignGraphs: CampaignGraph;
  years: string[] = [];
  colors = websafeColors.slice();

  private readonly dateFormat = 'YYYY-MM-DD';

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.months = moment.monthsShort();
    this.colors = this.colors.filter(
      color => !this.campaigns.find(campaign => campaign.color === color)
    );
    this.updateCampaigns();
  }

  openModal() {
    this.modalService
      .open(ModalAddCampaignComponent)
      .result
      .then(this.addCampaign.bind(this))
      .catch(this.doNothing);
  }

  deleteCampaign(campaign: Campaign) {
    const modalRef = this.modalService.open(CampaignDeletionConfirmationComponent);
    modalRef.componentInstance.campaignName = campaign.theme;
    modalRef
      .result
      .then(() => {
        const idx = this.campaigns.findIndex(c => c.id === campaign.id);
        this.campaigns.splice(idx, 1);
        this.campaignsChange.emit(this.campaigns);
        this.campaignGraphs = {};
        this.updateCampaigns();
      })
      .catch(this.doNothing);
  }

  editCampaign(campaign: Campaign) {
    if (this.readonly) {
      return;
    }
    const data = this.campaigns.find(item => item.id === campaign.id);
    const modalRef = this.modalService.open(ModalAddCampaignComponent);
    modalRef.componentInstance.campaign = data;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then(this.addCampaign.bind(this)).catch(this.doNothing);
  }

  trackByFn(index: number, item: Campaign) {
    return item.theme;
  }

  getCampaignWidthPercent(campaign: Campaign): number {
    const start = moment(campaign.startDate, this.dateFormat);
    const end = moment(campaign.endDate, this.dateFormat);
    const diff = end.diff(start, 'day') + 1;
    return diff * 100 / this.getDaysInYear(start);
  }

  getCampaignTopPercent(index: number, arrayLength: number): number {
    return (index + 1) * (100 / (arrayLength + 1));
  }

  getCampaignOffsetPercent(campaign: Campaign): number {
    const start = moment(campaign.startDate, this.dateFormat);
    const offsetDays = start.dayOfYear() - 1;
    return offsetDays * 100 / this.getDaysInYear(start);
  }

  private splitCampaignsByYear(campaigns: Campaign[]): CampaignGraph {
    return [].concat.apply([], campaigns
      .filter(campaign => campaign.startDate && campaign.endDate)
      .map(campaign => {
        let start = moment(campaign.startDate, this.dateFormat);
        const end = moment(campaign.endDate, this.dateFormat);
        const ranges = [];
        while (start.year() !== end.year()) {
          const lastDayOfYear = moment(start, this.dateFormat).endOf('year');
          ranges.push([start.format(this.dateFormat), lastDayOfYear.format(this.dateFormat)]);
          start = lastDayOfYear.add(1, 'day');
        }
        ranges.push([start.format(this.dateFormat), end.format(this.dateFormat)]);
        return ranges.map(range => ({
          ...campaign,
          startDate: range[0],
          endDate: range[1],
        }));
      }))
      .reduce((acc, campaign) => {
        const year = moment(campaign.startDate, this.dateFormat).year();
        if (!acc.hasOwnProperty(year)) {
          acc[year] = [];
        }
        acc[year].push(campaign);
        return acc;
      }, {});
  }

  private updateCampaigns() {
    this.campaignGraphs = this.splitCampaignsByYear(this.campaigns);
    this.years = Object.keys(this.campaignGraphs);
  }

  private addCampaign(campaign: Campaign) {
    const idx = this.campaigns.findIndex((item: Campaign) => item.id === campaign.id);
    if (idx >= 0) {
      this.campaigns.splice(idx, 1);
    } else {
      campaign.color = this.getColor();
    }
    this.campaigns.push(campaign);
    if (campaign.startDate) {
      this.sortCampaigns();
    }
    this.campaignGraphs = {};
    this.campaignsChange.emit(this.campaigns);
    this.updateCampaigns();
  }

  private sortCampaigns() {
    this.campaigns.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  private getDaysInYear(date: moment.Moment) {
    return date.isLeapYear() ? 366 : 365;
  }

  private getColor(): string {
    if (!this.colors.length) {
      return websafeColors[0];
    }
    return this.colors.shift();
  }

  private doNothing() {}
}
