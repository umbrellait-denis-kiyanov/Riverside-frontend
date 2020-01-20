import IceInputPlugin from './ice-input-plugin';

// disallow typing or pasting in the middle of a range of deleted text
// automatically start a new range after the deleted text instead
export class PreventTypeDeletedRangePlugin extends IceInputPlugin {
    keyDown(e: KeyboardEvent) {
        if (!this.isCurrentRangeEditable()) {
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

        const delElement = range.commonAncestorContainer.parentElement;
        const newRange = this.ice.selection.createRange();
        const placeholder = document.createElement('div');

        // insert placeholder before or after deleted text depending on cursor position
        delElement.parentNode.insertBefore(placeholder, 0 === range.endOffset ? delElement : delElement.nextSibling);

        newRange.setStart(placeholder, 0);
        this.ice.selection.addRange(newRange);
    }

    private isCurrentRangeEditable() {
        const range = this.ice.getCurrentRange();
        return !range.startContainer.parentElement.className.split(' ').includes('del');
    }
}