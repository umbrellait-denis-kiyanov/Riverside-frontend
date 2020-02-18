import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Campaign } from '../index';

@Component({
  selector: 'app-modal-add-campaign',
  templateUrl: './modal-add-campaign.component.html',
  styleUrls: ['./modal-add-campaign.component.sass']
})
export class ModalAddCampaignComponent {
  @Input() isEdit: boolean = false;
  campaign: Campaign = {
    id: '',
    theme: '',
    persona: [],
    messaging: '',
    tacticalMap: '',
    startDate: '',
    endDate: '',
    assigned: '',
    color: ''
  };
  isValidationError = false;

  constructor(public modal: NgbActiveModal) {}

  personaChange(selectedPersonas: number[]) {
    this.campaign.persona = selectedPersonas.slice();
  }

  submit() {
    if (!this.campaign.theme) {
      this.isValidationError = true;
      return;
    }
    if (!this.isEdit) {
      this.campaign.id = this.getId();
    }
    this.isValidationError = false;
    this.modal.close(this.campaign);
  }

  private getId(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }
}
