import IceInputPlugin from './ice-input-plugin';

// disable line breaks in input for single-line inputs
export default class DisableNewlinesPlugin extends IceInputPlugin {
    matchInput(input: string) {
        return input.match(/[\n\r]/).length > 0;
    }

    replaceInput() {
        return '';
    }

    onBlur(html) {
        return this.removeFormatting(html);
    }

    keyDown(e: KeyboardEvent) {
        if (e.which === 13) {
            e.preventDefault();
            return false;
        }

        return true;
    }

    forceCleanPaste() {
        return true;
    }
}