import IceInputPlugin from './ice-input-plugin';

// replace &nbsp;s with spaces to fix word wrapping
export default class FixSpacesPlugin extends IceInputPlugin {
    matchInput(input: string) {
        return input === '&nbsp;';
    }

    replaceInput() {
        // regular space doesn't work, so an UTF-8 space that matches the regular space the closest
        return '\u2004';
    }

    onBlur(html) {
        return html.split(/\&nbsp\;|\u2004/).join(' ');
    }
}