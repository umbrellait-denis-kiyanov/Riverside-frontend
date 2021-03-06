/* tslint:disable */
export function IceCopyPastePluginFixed() {
  (function() {
    const ice = window.ice;

    const IceCopyPastePlugin = function(ice_instance) {
      this._ice = ice_instance;
      this._tmpNode = null;
      this._tmpNodeTagName = 'icepaste';
      this._pasteId = 'icepastediv';
      const self = this;

      // API

      // 'formatted' - paste will be MS Word cleaned.
      // 'formattedClean' - paste will be MS Word cleaned, insert and
      //    delete tags will be removed keeping insert content in place,
      //    and tags not found in `preserve` will be stripped.
      this.pasteType = 'formattedClean';

      // Subset of tags that will not be stripped when pasteType
      // is set to 'formattedClean'. Parameter is of type string with
      // comma delimited tag and attribute definitions. For example:
      //   'p,a[href],i[style|title],span[*]'
      // Would allow `p`, `a`, `i` and `span` tags. The attributes for
      // each one of these tags would be cleaned as follows: `p` tags
      // would have all attributes removed, `a` tags will have all but
      // `href` attributes removed, `i` tags will have all but `style`
      // and `title` attributes removed, and `span` tags will keep all attributes.
      this.preserve = 'p';

      // Callback triggered before any paste cleaning happens
      this.beforePasteClean = function(body) {
        return body;
      };

      // Callback triggered at the end of the paste cleaning
      this.afterPasteClean = function(body) {
        return body;
      };

      // Event Listener for copying
      const el = ice_instance.element;
      el.addEventListener('copy', e => this.handleCopy(e));
      el.addEventListener('paste', e => this.handlePaste(e));
      el.addEventListener('cut', e => this.handleCut(e));
    };

    IceCopyPastePlugin.prototype = {
      setSettings(settings) {
        settings = settings || {};
        ice.dom.extend(this, settings);

        this.preserve += ',' + this._tmpNodeTagName;
        this.setupPreserved();
      },

      keyDown(e) {
        return true;
      },

      handleCopy(e) {},

      // Inserts a temporary placeholder for the current range and removes
      // the contents of the ice element body and calls a paste handler.
      handlePaste(e) {
        let range = this._ice.getCurrentRange();

        if (!range.collapsed) {
          if (this._ice.isTracking) {
            this._ice.deleteContents();
            range = range.cloneRange();
          } else {
            range.deleteContents();
            range.collapse(true);
          }
        }

        if (this._ice.isTracking) {
          this._ice._moveRangeToValidTrackingPos(range);
        }

        if (range.startContainer == this._ice.element) {
          // Fix a potentially empty body with a bad selection
          let firstBlock = ice.dom.find(
            this._ice.element,
            this._ice.blockEl
          )[0];
          if (!firstBlock) {
            firstBlock = ice.dom.create(
              '<' + this._ice.blockEl + ' ><br/></' + this._ice.blockEl + '>'
            );
            this._ice.element.appendChild(firstBlock);
          }
          range.setStart(firstBlock, 0);
          range.collapse(true);
          this._ice.env.selection.addRange(range);
        }

        this._tmpNode = this._ice.env.document.createElement(
          this._tmpNodeTagName
        );
        range.insertNode(this._tmpNode);

        const html = (e.originalEvent || e).clipboardData.getData('text/html');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        switch (this.pasteType) {
          case 'formatted':
            this.handlePasteValue(false, html);
            break;
          case 'formattedClean':
            this.handlePasteValue(true, html);
            break;
        }

        return true;
      },

      // By the time we get here, the pasted content will already be in the body. Extract the
      // paste, format it, remove any Microsoft or extraneous tags outside of `this.preserve`
      // and merge the pasted content into the original fragment body.
      handlePasteValue(stripTags, html) {
        // Get the pasted content.
        let doc = this._ice.env.document;

        html = this.beforePasteClean.call(this, html);

        if (stripTags) {
          // Strip out change tracking tags.
          html = this._ice.getCleanContent(html);
          html = this.stripPaste(html);
        }

        html = this.afterPasteClean.call(this, html);
        html = ice.dom.trim(html);
        let range = this._ice.getCurrentRange();
        range.setStartAfter(this._tmpNode);
        range.collapse(true);

        let innerBlock = null,
          lastEl = null,
          newEl = null;
        let fragment = range.createContextualFragment(html);
        let changeid = this._ice.startBatchChange();

        // If fragment contains block level elements, most likely we will need to
        // do some splitting so we do not have P tags in P tags, etc. Split the
        // container from current selection and then insert paste contents after it.
        if (ice.dom.hasBlockChildren(fragment)) {
          // Split from current selection.
          let block = ice.dom.isChildOfTagName(
            this._tmpNode,
            this._ice.blockEl
          );
          range.setEndAfter(block.lastChild);
          this._ice.selection.addRange(range);
          let contents = range.extractContents();
          let newblock = doc.createElement(this._ice.blockEl);
          newblock.appendChild(contents);
          ice.dom.insertAfter(block, newblock);

          range.setStart(newblock, 0);
          range.collapse(true);
          this._ice.selection.addRange(range);
          let prevBlock = range.startContainer;

          // Paste all of the children in the fragment.
          while (fragment.firstChild) {
            if (
              fragment.firstChild.nodeType === 3 &&
              !fragment.firstChild.nodeValue.trim()
            ) {
              fragment.removeChild(fragment.firstChild);
              continue;
            }
            // We may have blocks with text nodes at the beginning or end. For example, this paste:
            //  textnode <p>blocktext</p> <p>blocktext</p> moretext
            // In which case we wrap the leading or trailing text nodes in blocks.
            if (ice.dom.isBlockElement(fragment.firstChild)) {
              if (fragment.firstChild.textContent !== '') {
                innerBlock = null;
                let insert = null;
                if (this._ice.isTracking) {
                  insert = this._ice.createIceNode('insertType');
                  this._ice.addChange('insertType', [insert]);
                  newEl = doc.createElement(fragment.firstChild.tagName);
                  insert.innerHTML = fragment.firstChild.innerHTML;
                  newEl.appendChild(insert);
                } else {
                  insert = newEl = doc.createElement(
                    fragment.firstChild.tagName
                  );
                  newEl.innerHTML = fragment.firstChild.innerHTML;
                }
                lastEl = insert;
                ice.dom.insertBefore(prevBlock, newEl);
              }
              fragment.removeChild(fragment.firstChild);
            } else {
              if (!innerBlock) {
                // Create a new block and append an insert
                newEl = doc.createElement(this._ice.blockEl);
                ice.dom.insertBefore(prevBlock, newEl);
                if (this._ice.isTracking) {
                  innerBlock = this._ice.createIceNode('insertType');
                  this._ice.addChange('insertType', [innerBlock]);
                  newEl.appendChild(innerBlock);
                } else {
                  innerBlock = newEl;
                }
              }
              lastEl = innerBlock;
              innerBlock.appendChild(fragment.removeChild(fragment.firstChild));
            }
          }
          if (!newblock.textContent) {
            newblock.parentNode.removeChild(newblock);
          }
        } else {
          if (this._ice.isTracking) {
            newEl = this._ice.createIceNode('insertType', fragment);
            this._ice.addChange('insertType', [newEl]);
            range.insertNode(newEl);
            lastEl = newEl;
          } else {
            let child;
            while ((child = fragment.firstChild)) {
              range.insertNode(child);
              range.setStartAfter(child);
              range.collapse(true);
              lastEl = child;
            }
          }
        }
        this._ice.endBatchChange(changeid);

        this._cleanup(lastEl);
      },

      createDiv(id) {
        let doc = this._ice.env.document, // Document object of window or tinyMCE iframe
          oldEl = doc.getElementById(id);
        if (oldEl) {
          ice.dom.remove(oldEl);
        }

        let div = doc.createElement('div');
        div.id = id;
        div.setAttribute('contentEditable', true);
        ice.dom.setStyle(div, 'width', '1px');
        ice.dom.setStyle(div, 'height', '1px');
        ice.dom.setStyle(div, 'overflow', 'hidden');
        ice.dom.setStyle(div, 'position', 'fixed');
        ice.dom.setStyle(div, 'top', '10px');
        ice.dom.setStyle(div, 'left', '10px');

        div.appendChild(doc.createElement('br'));
        doc.body.appendChild(div);
        return div;
      },

      // Intercepts cut operation and handles by creating an editable div, copying the current selection
      // into it, deleting the current selection with track changes, and selecting the contents in the
      // editable div.
      handleCut() {
        let self = this,
          range = this._ice.getCurrentRange();
        if (range.collapsed) {
          return;
        } // If nothing is selected, there's nothing to mark deleted

        this.cutElement = this.createDiv('icecut');
        // Chrome strips out spaces between text nodes and elements node during cut
        this.cutElement.innerHTML = range
          .getHTMLContents()
          .replace(/ </g, '&nbsp;<')
          .replace(/> /g, '>&nbsp;');

        if (this._ice.isTracking) {
          this._ice.deleteContents();
        } else {
          range.deleteContents();
        }

        let crange = this._ice.env.document.createRange();
        crange.setStart(this.cutElement.firstChild, 0);
        crange.setEndAfter(this.cutElement.lastChild);

        setTimeout(function() {
          self.cutElement.focus();

          // After the browser cuts out of the `cutElement`, reset the range and remove the cut element.
          setTimeout(function() {
            ice.dom.remove(self.cutElement);
            range.setStart(range.startContainer, range.startOffset);
            range.collapse(false);
            self._ice.env.selection.addRange(range);
          }, 100);
        }, 0);

        self._ice.env.selection.addRange(crange);
      },

      // Strips ice change tracking tags, Microsoft Word styling/content, and any
      // tags and attributes not found in `preserve` from the given `content`.
      stripPaste(content) {
        // Clean word stuff out and strip tags that are not in `this.preserve`.
        content = this._cleanWordPaste(content);
        content = this.cleanPreserved(content);
        return content;
      },

      // Parses `preserve` to setup `_tags` with a comma delimited list of all of the
      // defined tags, and the `_attributesMap` with a mapping between the allowed tags and
      // an array of their allowed attributes. For example, given this value:
      //   `preserve` = 'p,a[href|class],span[*]'
      // The following will result:
      //   `_tags` = 'p,a,span'
      //   `_attributesMap` = ['p' => [], 'a' => ['href', 'class'], 'span' => ['*']]
      setupPreserved() {
        let self = this;
        this._tags = '';
        this._attributesMap = [];

        ice.dom.each(this.preserve.split(','), function(i, tagAttr) {
          // Extract the tag and attributes list
          tagAttr.match(/(\w+)(\[(.+)\])?/);
          let tag = RegExp.$1;
          let attr = RegExp.$3;

          if (self._tags) {
            self._tags += ',';
          }
          self._tags += tag.toLowerCase();
          self._attributesMap[tag] = attr.split('|');
        });
      },

      // Cleans the given `body` by removing any tags not found in `_tags` and replacing them with
      // their inner contents, and removes attributes from any tags that aren't mapped in `_attributesMap`.
      cleanPreserved(body) {
        let self = this;
        let bodyel = this._ice.env.document.createElement('div');
        bodyel.innerHTML = body;

        // Strip out any tags not found in `this._tags`, replacing the tags with their inner contents.
        bodyel = ice.dom.stripEnclosingTags(bodyel, this._tags);

        // Strip out any attributes from the allowed set of tags that don't match what is in the `_attributesMap`
        ice.dom.each(ice.dom.find(bodyel, this._tags), function(i, el) {
          if (ice.dom.hasClass(el, 'skip-clean')) {
            return true;
          }
          let tag = el.tagName.toLowerCase();
          let attrMatches = self._attributesMap[tag];

          // Kleene star - keep all of the attributes for this tag.
          if (attrMatches[0] && attrMatches[0] === '*') {
            return true;
          }

          // Remove any foreign attributes that do not match the map.
          if (el.hasAttributes()) {
            let attributes = el.attributes;
            for (let i = attributes.length - 1; i >= 0; i--) {
              if (!ice.dom.inArray(attributes[i].name, attrMatches)) {
                el.removeAttribute(attributes[i].name);
              }
            }
          }
        });
        return bodyel.innerHTML;
      },

      _cleanWordPaste(content) {
        // Meta and link tags.
        content = content.replace(/<(meta|link)[^>]+>/g, '');

        // Comments.
        content = content.replace(/<!--(.|\s)*?-->/g, '');

        // Remove style tags.
        content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

        // Remove span and o:p etc. tags.
        // content = content.replace(/<\/?span[^>]*>/gi, "");
        content = content.replace(/<\/?\w+:[^>]*>/gi, '');

        // Remove XML tags.
        content = content.replace(/<\\?\?xml[^>]*>/gi, '');

        // Generic cleanup.
        content = this._cleanPaste(content);

        // Remove class, lang and style attributes.
        content = content.replace(
          /<(\w[^>]*) (lang)=([^ |>]*)([^>]*)/gi,
          '<$1$4'
        );

        return content;
      },

      _cleanPaste(content) {
        // Some generic content cleanup. Change all b/i tags to strong/em.
        content = content.replace(/<b(\s+|>)/g, '<strong$1');
        content = content.replace(/<\/b(\s+|>)/g, '</strong$1');
        content = content.replace(/<i(\s+|>)/g, '<em$1');
        content = content.replace(/<\/i(\s+|>)/g, '</em$1');
        return content;
      },

      _cleanup(moveTo) {
        try {
          // Set focus back to ice element.
          if (this._ice.env.frame) {
            this._ice.env.frame.contentWindow.focus();
          } else {
            this._ice.element.focus();
          }

          moveTo = (moveTo && moveTo.lastChild) || moveTo || this._tmpNode;
          // Move the range to the end of moveTo so that the cursor will be at the end of the paste.
          let range = this._ice.getCurrentRange();
          range.setStartAfter(moveTo);
          range.collapse(true);
          this._ice.selection.addRange(range);

          // Kill the tmp node.
          this._tmpNode.parentNode.removeChild(this._tmpNode);
          this._tmpNode = null;
          // Kill any empty change nodes.
          let ins = this._ice.env.document.getElementsByClassName(
            this._ice.changeTypes.insertType.alias
          );
          for (let i = 0; i < ins.length; i++) {
            if (!ins[i].textContent) {
              if (ins[i].parentNode) {
                ins[i].parentNode.removeChild(ins[i]);
              }
            }
          }
        } catch (e) {
          window.console && console.error(e);
        }
      }
    };

    ice.dom.noInclusionInherits(IceCopyPastePlugin, ice.IcePlugin);
    this._plugin.IceCopyPastePluginFixed = IceCopyPastePlugin;
  }.call(window.ice));
}
