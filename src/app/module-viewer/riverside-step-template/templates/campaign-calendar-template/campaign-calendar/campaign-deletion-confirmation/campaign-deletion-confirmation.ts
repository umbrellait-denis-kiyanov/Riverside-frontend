import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'campaign-deletion-confirmation',
  templateUrl: './campaign-deletion-confirmation.html'
})
export class CampaignDeletionConfirmationComponent {
  campaignName: string;

  constructor(public modal: NgbActiveModal) {}
}
