import { IceEditorTracker } from '../ice.component';

// based on IceEmdashPlugin plugin - https://github.com/nytimes/ice/blob/master/src/plugins/IceEmdashPlugin/IceEmdashPlugin.js

// @todo - define plugin dependencies to make sure they are loaded in a correct order?

export default class IceInputPlugin {
  pluginID: string;

  ice: IceEditorTracker;

  constructor() {
    const pluginID = this.constructor.name;
    // tslint:disable-next-line
    const self = this;

    (function() {
      if (this._plugin[pluginID]) {
        return;
      }

      // tslint:disable-next-line
      const ice = this;

      const InputPlugin = function(ice_instance: IceEditorTracker) {
        this._ice = ice_instance;

        self.ice = ice_instance;

        const editor = ice_instance.element;
        self.addEventListeners(editor);

        editor.addEventListener(
          'blur',
          () => (editor.innerHTML = self.onBlur(editor.innerHTML))
        );

        // temporarily prevent text drag&drop into <ice> field. @todo: implement
        if (!ice_instance.disableDragDrop) {
          ice_instance.disableDragDrop = true;
          ice_instance.element.addEventListener('drop', e =>
            e.preventDefault()
          );
        }

        if (self.forceCleanPaste() && !ice_instance.hasCleanPaste) {
          ice_instance.hasCleanPaste = true;
          ice_instance.element.addEventListener('paste', e => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');

            const node = this._ice.env.document.createTextNode(text);

            const range = this._ice.getCurrentRange();
            this._ice._insertNode(node, range);
            range.moveStart(ice.dom.CHARACTER_UNIT, text.length);
          });
        }
      };

      InputPlugin.prototype = {
        keyDown(e) {
          if (
            e.which === 8 ||
            e.which === 46 ||
            (e.which >= 35 && e.which <= 40)
          ) {
            return true;
          }

          if (self.keyDown(e)) {
            this.convertKey(e);

            return true;
          }
        },

        convertKey(e) {
          const range = this._ice.getCurrentRange();

          if (range.collapsed) {
            try {
              // Move the start back one character so we can enclose the range
              // around the previous character to check if it is a dash
              range.moveStart(ice.dom.CHARACTER_UNIT, -1);
              // Get the parent block element for the start and end containers
              const startBlock = ice.dom.getParents(
                range.startContainer,
                this._ice.blockEl
              )[0];
              const endBlock = ice.dom.getParents(
                range.endContainer,
                this._ice.blockEl
              )[0];
              // Make sure that the start and end containers aren't in different blocks, or that the start isn't in a delete.
              if (
                startBlock === endBlock &&
                !this._ice.getIceNode(range.startContainer, 'deleteType')
              ) {
                const c = range.toHtml();
                if (self.matchInput(c)) {
                  range.extractContents();
                  range.collapse();

                  const replacedInput = self.replaceInput(c);

                  const replacedNode =
                    typeof replacedInput === 'string'
                      ? this._ice.env.document.createTextNode()
                      : replacedInput;

                  if (this._ice.isTracking) {
                    this._ice._insertNode(replacedNode, range);
                  } else {
                    range.insertNode(replacedNode);
                    range.setStart(replacedNode, 1);
                    range.collapse(true);
                  }

                  return false;
                }
              }
            } catch (e) {}
            range.collapse();
          }

          return true;
        }
      };

      this.dom.noInclusionInherits(InputPlugin, window.ice.IcePlugin);
      this._plugin[pluginID] = InputPlugin;
    }.call(window.ice));
  }

  protected getEditor() {
    let node = this.ice.getCurrentRange()
      .commonAncestorContainer as HTMLElement;
    while (node && node.parentElement) {
      node = node.parentElement;
      if (node.contentEditable === 'true') {
        return node;
      }
    }
  }

  protected matchInput(input: string) {
    return false;
  }

  protected replaceInput(input: string): string | HTMLElement {
    return '';
  }

  protected onBlur(html) {
    return html;
  }

  protected keyDown(e: KeyboardEvent) {
    return false;
  }

  protected addEventListeners(element: HTMLElement): void {}

  protected forceCleanPaste() {
    return false;
  }

  protected stopEvent(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
  }

  // remove HTML formatting except for Ice tracker elements
  protected removeFormatting(html: string) {
    const parser = new DOMParser().parseFromString(html || '', 'text/html');

    // replace all non-ins/del elements to simple div's
    let toReplace;
    do {
      toReplace = parser.body.querySelectorAll(
        ':not(.ins):not(.del):not(.ice_replaced)'
      );
      toReplace.forEach(node => {
        const newNode = document.createElement('div');
        newNode.className = 'ice_replaced';
        newNode.innerHTML = node.innerHTML;
        node.parentNode.replaceChild(newNode, node);
      });
    } while (toReplace.length);

    // now strip out the div's and only the Ice tracker elements remain in formatting
    return (
      '<p>' +
      parser.body.innerHTML
        .trim()
        .replace(/\<div class\="ice_replaced"\>|\<\/div\>/g, '') +
      '</p>'
    );
  }
}
