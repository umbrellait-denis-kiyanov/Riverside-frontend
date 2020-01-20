import IceInputPlugin from './ice-input-plugin';

// replace &nbsp;s with spaces to fix word wrapping
export class FixSpacesPlugin extends IceInputPlugin {
    onBlur(html) {
        return html.split(/\&nbsp;/).join(' ');
    }
}