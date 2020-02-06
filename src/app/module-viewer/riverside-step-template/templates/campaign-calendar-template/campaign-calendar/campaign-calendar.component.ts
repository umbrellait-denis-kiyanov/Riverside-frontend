import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddCampaignComponent } from './modal-add-campaign/modal-add-campaign.component';
import { Campaign } from '../../../../../common/interfaces/campaign.interface';
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
  @Output() campaignsChange: EventEmitter<Campaign[]> = new EventEmitter<Campaign[]>();
  @Input() campaigns: Campaign[] = [];
  months: string[];
  campaignGraphs: { [key: string]: Campaign[] } = {};
  years: string[] = [];
  colors: string[] = websafeColors.slice();

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
    const data = this.campaigns.find((item: Campaign) => item.id === campaign.id);
    const modalRef = this.modalService.open(ModalAddCampaignComponent);
    modalRef.componentInstance.campaign = data;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then(this.addCampaign.bind(this)).catch(this.doNothing);
  }

  trackByFn(index: number, item: Campaign) {
    return item.theme;
  }

  getCampaignWidth(table: HTMLElement, tableLabel: HTMLElement, campaign: Campaign): number {
    const start = moment(campaign.startDate, this.dateFormat);
    const end = moment(campaign.endDate, this.dateFormat);
    const diff = end.diff(start, 'day') + 1;
    const borderWidth = 1;
    const monthsCellWidth = table.offsetWidth - 2 * borderWidth - tableLabel.offsetWidth;
    return Math.round(diff * monthsCellWidth / this.getDaysInYear(start));
  }

  getCampaignOffset(table: HTMLElement, tableLabel: HTMLElement, campaign: Campaign): number {
    const start = moment(campaign.startDate, this.dateFormat);
    const offsetDays = start.dayOfYear() - 1;
    const persentageOffset = offsetDays / this.getDaysInYear(start);
    const borderWidth = 1;
    const monthsCellWidth = table.offsetWidth - 2 * borderWidth - tableLabel.offsetWidth;
    const offset = Math.round(monthsCellWidth * persentageOffset);
    return tableLabel.offsetWidth + offset;
  }

  private splitCampaignsByYear(campaigns: Campaign[]) {
    campaigns.forEach((campaign: Campaign) => {
      if (!campaign.startDate || !campaign.endDate) {
        return;
      }
      const start = moment(campaign.startDate, this.dateFormat);
      const end = moment(campaign.endDate, this.dateFormat);
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

  private splitCampaignByYear(campaign: Campaign): Campaign[] {
    const lastDayOfFirstYear = moment(campaign.startDate, this.dateFormat).endOf('year');
    return [
      {
        ...campaign,
        endDate: lastDayOfFirstYear.format(this.dateFormat),
      },
      {
        ...campaign,
        startDate: lastDayOfFirstYear.add(1, 'day').format(this.dateFormat),
      },
    ];
  }

  private updateCampaigns() {
    this.splitCampaignsByYear(this.campaigns);
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
