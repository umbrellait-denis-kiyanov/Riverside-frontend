import IceInputPlugin from './ice-input-plugin';

// disallow typing or pasting in the middle of a range of deleted text
// automatically start a new range after the deleted text instead
export default class PreventTypeDeletedRangePlugin extends IceInputPlugin {
    keyDown(e: KeyboardEvent) {
        //    backspace         delete              home/end, arrow keys
        if (e.which !== 8 && e.which !== 46 && !(e.which >= 35 && e.which <= 40) && !this.isCurrentRangeEditable()) {
            this.createNewRange();
        }

        return true;
    }

    public addEventListeners(element: HTMLElement) {
        element.addEventListener('paste', e => {
            if (!this.isCurrentRangeEditable())
            {
                this.createNewRange();
            }
        });
    }

    private createNewRange() {
        const range = this.ice.getCurrentRange();

        const delElement = range.nativeRange.commonAncestorContainer.parentElement;
        const newRange = this.ice.selection.createRange();
        const placeholder = document.createElement('span');

        // insert placeholder before or after deleted text depending on cursor position
        delElement.parentNode.insertBefore(placeholder, 0 === range.endOffset ? delElement : delElement.nextSibling);

        newRange.setStart(placeholder, 0);
        this.ice.selection.addRange(newRange);
    }

    private isCurrentRangeEditable() {
        const range = this.ice.getCurrentRange();
        return !range.startContainer.parentNode.className.split(' ').includes('del');
    }
}