// replace &nbsp;s with spaces to fix word wrapping
// based on IceEmdashPlugin plugin - https://github.com/nytimes/ice/blob/master/src/plugins/IceEmdashPlugin/IceEmdashPlugin.js
export default function InitIceFixSpacesPlugin() {
  (function() {
    if (this._plugin.FixSpacesPlugin) {
        return;
    }

    const FixSpacesPlugin = function(ice_instance) {
        this._ice = ice_instance;
    };

    const ice = this;

    FixSpacesPlugin.prototype = {

        keyDown: function(e) {
            this.convertSpace(e);
            return true;
        },

        convertSpace: function(e) {
        const range = this._ice.getCurrentRange();

        const editor = range.nativeRange.commonAncestorContainer.parentElement.parentElement.parentElement;
        if (!editor.hasAttribute('blurReplaceSpace')) {
            editor.setAttribute('blurReplaceSpace', '1');
            editor.addEventListener('blur', () => editor.innerHTML = editor.innerHTML.split(/\&nbsp\;|\u2004/).join(' '));
        }

        if (range.collapsed) {
            try {
            // Move the start back one character so we can enclose the range around the previous character to check if it is a dash
            range.moveStart(ice.dom.CHARACTER_UNIT, -1);
            // Get the parent block element for the start and end containers
            const startBlock = ice.dom.getParents(range.startContainer, this._ice.blockEl)[0];
            const endBlock = ice.dom.getParents(range.endContainer, this._ice.blockEl)[0];
            // Make sure that the start and end containers aren't in different blocks, or that the start isn't in a delete.
            if(startBlock === endBlock && !this._ice.getIceNode(range.startContainer, 'deleteType')) {

                let c = range.toHtml();
                if(c === '&nbsp;') {

                range.extractContents();
                range.collapse();
                // regular space doesn't work, so an UTF-8 space that matches the regular space the closest
                const mdash = this._ice.env.document.createTextNode('\u2004');

                if (this._ice.isTracking) {
                    this._ice._insertNode(mdash, range);
                } else {
                    range.insertNode(mdash);
                    range.setStart(mdash, 1);
                    range.collapse(true);
                }

                return false;
                }
            }
            } catch(e) {}
            range.collapse();
        }

        return true;
        }
    };

    this.dom.noInclusionInherits(FixSpacesPlugin, window.ice.IcePlugin);
    this._plugin.FixSpacesPlugin = FixSpacesPlugin;

    }).call(window.ice);
}