import IceInputPlugin from './ice-input-plugin';

// disable line breaks in input for single-line inputs
export class DisableNewlinesPlugin extends IceInputPlugin {
    protected matchInput(input: string) {
        return input.match(/[\n\r]/).length > 0;
    }

    protected replaceInput() {
        return '';
    }

    protected onBlur(html) {
        return this.removeFormatting(html);
    }

    protected keyDown(e: KeyboardEvent) {
        if (e.which === 13) {
            e.preventDefault();
            return false;
        }

        return true;
    }

    protected forceCleanPaste() {
        return true;
    }
}
