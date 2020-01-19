import IceInputPlugin from './ice-input-plugin';

// start an ordered or unordered list after user types * or 1. at a beginning of a new line
export default class InitListPlugin extends IceInputPlugin {
    keyDown(e: KeyboardEvent) {
        const range = this.ice.getCurrentRange();
        const cont = range.startContainer.parentElement;

        if (cont.textContent === '*' && e.key === ' ') {
            this.insertList(e, range, cont, 'ul');
        } else if (cont.textContent === '1' && e.key === '.') {
            this.insertList(e, range, cont, 'ol');
        }

        return true;
    }

    insertList(e: KeyboardEvent, range: Range, cont: HTMLElement, tag: 'ul' | 'ol') {
        this.stopEvent(e);
        cont.innerHTML = '<' + tag + '><li></li></' + tag + '>';
        range.setStart(cont.querySelector('li'), 0);
    }
}