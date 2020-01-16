import IceInputPlugin from './ice-input-plugin';

// disallow typing in the middle of a range of deleted text
// @todo - automatically start a new range after the deleted text instead
export default class PreventTypeDeletedRangePlugin extends IceInputPlugin {
    keyDown(e: KeyboardEvent) {
        // home/end, arrow keys
        if (e.which >= 35 && e.which <= 40) {
            return true;
        }

        if (!this.isCurrentRangeEditable())
        {
            this.stopEvent(e);
            return false;
        }

        return true;
    }

    public addEventListeners(element: HTMLElement) {
        element.addEventListener('paste', e => {
            if (!this.isCurrentRangeEditable())
            {
                this.stopEvent(e);
            }
        });
    }

    private isCurrentRangeEditable() {
        const range = this.ice.getCurrentRange();
        return !range.startContainer.parentNode.className.split(' ').includes('del');
    }
}