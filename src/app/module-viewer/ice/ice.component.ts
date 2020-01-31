import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Input,
  HostListener,
  EventEmitter,
  Output
} from '@angular/core';
import User from 'src/app/common/interfaces/user.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { IceService } from './ice.service';
import { E3ConfirmationDialogService } from 'src/app/common/components/e3-confirmation-dialog/e3-confirmation-dialog.service';
import { TemplateComponent } from '../riverside-step-template/templates/template-base.class';
import { TemplateInput, InputComment } from 'src/app/common/interfaces/module.interface';
import * as moment from 'moment';
import {
  FixSpacesPlugin,
  DisableNewlinesPlugin,
  UndoTrackPlugin,
  NumericInputPlugin,
  InitListPlugin,
  PreventTypeDeletedRangePlugin
} from './plugins';
import IceCopyPastePluginFixed from './plugins/copy-paste-plugin-fixed';

export type TextRange = Range & {
  moveStart: (unit, offset: number) => void;
};

export interface IceEditorTracker {
  element: HTMLElement;
  env: {
    document: Document;
  },
  acceptAll: () => void;
  getUserStyle: (id: string) => string;
  getCurrentRange: () => TextRange,
  _insertNode: (node: Node, range: Range) => void;
  selection: {
    addRange: (range: TextRange) => void,
    createRange: () => TextRange
  },
  hasCleanPaste: boolean;
  disableDragDrop: boolean;
}

export class Comments {
  adding = false;
  content = '';
  list: InputComment[] = [];
  editingIndex: number = null;
  show = false;
  index: number = null;
}

type IcePluginConfig = {
  name: string,
  settings: {[key: string]: string}
};

@Component({
  selector: 'ice',
  templateUrl: './ice.component.html',
  styleUrls: ['./ice.component.sass']
})
export class IceComponent implements OnInit, OnDestroy {
  @Input() box: number;
  @Input('disabled') disabledCustomCondition: boolean;
  @Input() placeholder: string = '';

  // pass input as string identifier or as instance
  @Input() input?: string;
  @Input() prefix?: string;
  @Input() idx?: number;

  @Input() data: TemplateInput;
  @Input() single = false;
  @Input() numeric = false;

  @Input() allowRemoveSelections = false;

  @Output() changed = new EventEmitter(false);
  @Output() dataChanged = new EventEmitter(false);

  tracker: IceEditorTracker;
  comment = new Comments();
  menuComment: InputComment;
  menuIndex: number;

  isInitialized = false;

  user: User;
  disabled: boolean;

  initialContent: string;

  selectionsSub: Subscription;
  onApproveSub: Subscription;

  constructor(
    private el: ElementRef,
    private iceService: IceService,
    private dialogService: E3ConfirmationDialogService,
    private template: TemplateComponent
  ) {}

  ngOnInit() {
    new FixSpacesPlugin();
    new PreventTypeDeletedRangePlugin();
    new UndoTrackPlugin();
    IceCopyPastePluginFixed();

    if (this.numeric) {
      this.single = true;
      new NumericInputPlugin();
    }

    if (this.single) {
      new DisableNewlinesPlugin();
    } else {
      new InitListPlugin();
    }

    if (this.input) {
      this.data = this.template.getInput(this.input, this.idx, this.prefix);
    }

    if (!this.data) {
      console.error('No input data found for ', this.input);
      return;
    }

    this.data.error = this.data.error || new BehaviorSubject(null);

    this.user = this.template.me;
    this.disabled = this.template.disabled || this.disabledCustomCondition;

    if (!this.changed.observers.length) {
      this.changed.subscribe((event) => this.template.contentChanged(event));
    }

    const el: HTMLDivElement = document.createElement('div');
    el.innerHTML = this.data.content;

    // Add missing root element (can happen because of a bug elsewhere)
    if (el.innerHTML.length && el.innerHTML.substr(0, 2).toLowerCase() !== '<p') {
      el.innerHTML = '<p>' + el.innerHTML + '</p>';
    }

    const selections = el.querySelector('.matrix-options');

    if (selections) {
      this.data.selections$.next(
        Array.prototype.slice
          .call(selections.querySelectorAll('span'))
          .map(node => node.innerHTML)
      );

      selections.remove();

      this.selectionsSub = this.data.selections$.pipe(skip(1)).subscribe(_ => {
        this.blur();
        this.changed.emit();
      });
    }

    this.initialContent = el.innerHTML;

    if (this.data.comments_json && this.data.comments_json.length) {
      this.comment.list = this.data.comments_json;
    }

    setTimeout(() => {
      const text = this.el.nativeElement.querySelector('.textbody');

      const plugins: (string | IcePluginConfig)[] = ['IceAddTitlePlugin'];

      if (this.single) {
        plugins.push('DisableNewlinesPlugin');
      } else {
        plugins.push('InitListPlugin');
      }

      if (!this.numeric) {
        plugins.push('IceSmartQuotesPlugin');
        plugins.push('IceEmdashPlugin');
        plugins.push('FixSpacesPlugin');
      }

      plugins.push('PreventTypeDeletedRangePlugin');
      plugins.push('UndoTrackPlugin');

      if (this.numeric) {
        plugins.push('NumericInputPlugin');
      }

      plugins.push({
        name: 'IceCopyPastePluginFixed',
        settings: {
          pasteType: 'formattedClean',
          preserve: this.single ? '' : 'ol,ul,li'
        }
      });

      try {
        const tracker = new window.ice.InlineChangeEditor({
          element: text,
          handleEvents: true,
          currentUser: this.user,
          plugins: plugins,
          changeTypes: {
            insertType: {
              tag: 'div',
              alias: 'ins',
              action: 'Inserted'
            },
            deleteType: {
              tag: 'div',
              alias: 'del',
              action: 'Deleted'
            }
          }
        }).startTracking() as IceEditorTracker;

        if (tracker.element.innerHTML === '<p><br></p>') {
          tracker.element.innerHTML = '';
        }

        tracker.element.setAttribute('placeholder', this.placeholder);

        this.tracker = tracker;
      } catch (e) {
        console.error(e.message);
        text.contentEditable = 'false';
        return;
      }

      const w = String(this.el.nativeElement.clientWidth) + 'px';
      this.el.nativeElement.style.width = w;
      this.el.nativeElement.style.maxWidth = w;

      if (this.disabled) {
        this.tracker.element.contentEditable = 'false';
      }
      this.tracker.element.blur();
      this.onApproveSub = this.iceService.onApprove.subscribe(() => {
        this.tracker.acceptAll();
        this.blur();
      });
    });
  }

  ngOnDestroy() {
    this.changed.unsubscribe();

    if (this.selectionsSub) {
      this.selectionsSub.unsubscribe();
    }

    if (this.onApproveSub) {
      this.onApproveSub.unsubscribe();
    }
  }

  removeSelection(selection: string) {
    const selections = this.data.selections$.value.filter(
      sel => sel !== selection
    );
    this.data.selections$.next(selections);
  }

  addComment($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.comment.adding = true;
    this.closeComment();
    this.openComment();
  }

  cancelComment() {
    this.comment.adding = false;
    this.comment.content = '';
    this.comment.index = null;
    this.closeComment();
  }

  saveComment(index: false | number = false) {
    if (this.comment.index !== null) {
      this.comment.list[this.comment.index].content = this.comment.content;
    } else {
      const time = new Date().getTime();
      this.comment.list.push({
        content: this.comment.content,
        user: this.user,
        time,
        formattedTime: moment(time).format('MMM DD YYYY hh:mma')
      });
    }

    this.data.comments_json = this.comment.list;
    this.cancelComment();
    this.dataChanged.emit(this.data);
    this.changed.emit(this.data);
    setTimeout(_ => this.openComment(), 100);
  }

  mouseEnter() {
    if (this.comment.list && this.comment.list.length) {
      this.openComment();
    }
  }

  private openComment() {
    this.comment.show = true;
  }

  closeComment() {
    this.comment.show = false;
  }

  @HostListener('click', ['$event'])
  click() {
    if (this.iceService.shouldShowWarning && !this.disabled) {
      this.dialogService.open({
        content: this.iceService.warningText,
        onCancel: () => {
          this.tracker.element.blur();
        },
        onClose: () => {
          this.iceService.shouldShowWarning = false;
          this.iceService.onUnapprove.emit();
        }
      });
    }
  }

  editClicked(event: MouseEvent) {
    this.menuClicked(event);
    this.comment.content = this.menuComment.content;
    this.comment.index = this.menuIndex;
    this.comment.adding = true;
  }

  deleteClicked(event: MouseEvent) {
    this.menuClicked(event);
    this.comment.list.splice(this.menuIndex, 1);
    this.data.comments_json = this.comment.list;
  }

  menuClicked(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('keyup', ['$event'])
  keyEvent(e: KeyboardEvent) {
    if ((e.which < 48 && e.which !== 32 && e.which !== 8) || e.which > 90) {
      return false;
    }

    this.data.error.next(null);
  }

  blur() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      return;
    }

    const { element } = this.tracker;

    const selections = this.data.selections$ && this.data.selections$.value;

    this.data.content =
      (selections && selections.length
        ? '<p class="matrix-options">' +
          (selections || []).map(sel => '<span>' + sel + '</span>').join('') +
          '</p>'
        : '') + element.innerHTML.replace(/&nbsp;/g, ' ');

    this.dataChanged.emit(this.data);
    this.changed.emit(this.data);
  }

  change(e: KeyboardEvent) {
    setTimeout(_ => this.blur(), 100);
  }
}
