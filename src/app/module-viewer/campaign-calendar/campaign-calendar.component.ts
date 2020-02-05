import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddCampaignComponent } from './modal-add-campaign/modal-add-campaign.component';
import { Campaign } from '../../common/interfaces/campaign.interface';

@Component({
  selector: 'app-campaign-calendar',
  templateUrl: './campaign-calendar.component.html',
  styleUrls: ['./campaign-calendar.component.sass'],
})
export class CampaignCalendarComponent implements OnInit {
  @Output() campaignsChange: EventEmitter<Campaign[]> = new EventEmitter<Campaign[]>();
  @Input('campaigns') set setCampaigns(campaigns: Campaign[]) {
    this.campaigns = [...campaigns].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  campaigns: Campaign[] = [
    {
      theme: 'Strategic Plan',
      persona: 'Some Persona',
      messaging: 'Some messagisadgfnaadsfdsa dsaf',
      tacticalMap: 'WTF?',
      startDate: '2019-11-11',
      endDate: '2021-11-11',
      assigned: 'User',
    }
  ];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  addCampaign(campaign: Campaign) {
    this.campaigns.push(campaign);
    if (campaign.startDate) {
      this.setCampaigns = this.campaigns;
    }
  }

  openModal() {
    this.modalService
      .open(ModalAddCampaignComponent)
      .result
      .then(this.addCampaign.bind(this));
  }
}
