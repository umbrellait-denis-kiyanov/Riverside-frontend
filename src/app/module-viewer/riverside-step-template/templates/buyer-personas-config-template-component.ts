import {TemplateComponent} from './template-base.class';
import {TemplateInput} from '../../../common/interfaces/module.interface';

export default abstract class BuyerPersonasConfigTemplateComponent extends TemplateComponent {
    protected init() {
        this.contentChanged$.subscribe(_ => {
            this.buyerPersonasService.reloadBuyerPersonas();
        });
    }
}
