import { TemplateComponent } from './template-base.class';
import { TemplateInput } from '../../../common/interfaces/module.interface';

export default abstract class BuyerPersonasConfigTemplateComponent extends TemplateComponent {
  contentChanged(data: TemplateInput) {
      if (data) {
            this.moduleService.saveInput(data)
                .subscribe(_ => this.buyerPersonasService.reloadBuyerPersonas());
            if (data.observer) {
                data.observer.next(data.getValue());
            }
        }
    }
}
