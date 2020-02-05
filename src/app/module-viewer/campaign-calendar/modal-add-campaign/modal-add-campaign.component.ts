import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Campaign } from '../../../common/interfaces/campaign.interface';

@Component({
  selector: 'app-modal-add-campaign',
  templateUrl: './modal-add-campaign.component.html',
  styleUrls: ['./modal-add-campaign.component.sass'],
})
export class ModalAddCampaignComponent implements OnInit {
  campaign: Campaign = {
    theme: '',
    persona: '',
    messaging: '',
    tacticalMap: '',
    startDate: '',
    endDate: '',
    assigned: ''
  };

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.modal.close();
  }

  submit() {
    this.modal.close(this.campaign);
  }
}
