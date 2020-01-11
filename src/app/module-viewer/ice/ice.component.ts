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
import { TemplateComponent } from '../riverside-step-template/templates/template-base.cass';
import { Input as InputType } from 'src/app/common/interfaces/module.interface';

export type IceEditorTracker = {
  element: HTMLElement,
  acceptAll: () => void,
  getUserStyle: (id: string) => string
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
  @Input() input: string;
  @Input() data: InputType;

  @Input() allowRemoveSelections = false;

  @Output() changed = new EventEmitter(false);
  @Output() dataChanged = new EventEmitter(false);

  tracker: IceEditorTracker;
  comment: { [key: string]: any; index: false | number } = {
    adding: false,
    content: '',
    list: [],
    editingIndex: 0,
    show: false,
    index: false
  };
  menuComment: any;
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
    if (this.input) {
      this.data = this.template.getInput(this.input);
    }

    this.data.error = this.data.error || new BehaviorSubject(null);

    this.user = this.template.me;
    this.disabled = this.template.disabled || this.disabledCustomCondition;

    if (!this.changed.observers.length) {
      this.changed.subscribe((event) => this.template.contentChanged(event));
    }

    const el: HTMLDivElement = document.createElement('div');
    el.innerHTML = this.data.content;
    const selections = el.querySelector('.matrix-options');

    if (selections) {
      this.data.selections$.next(
        Array.prototype.slice
          .call(selections.querySelectorAll('span'))
          .map(node => node.innerHTML)
      );

      selections.remove();
    }

    this.selectionsSub = this.data.selections$.pipe(skip(1)).subscribe(_ => {
      this.onBlur();
      this.changed.emit();
    });

    this.initialContent = el.innerHTML;

    if (this.data.comments_json && this.data.comments_json.length) {
      this.comment.list = this.data.comments_json;
    }

    setTimeout(() => {
      const text = this.el.nativeElement.querySelector('.textbody');

      try {
        const tracker = new window.ice.InlineChangeEditor({
          element: text,
          handleEvents: true,
          currentUser: this.user,
          plugins: [
            'IceAddTitlePlugin',
            'IceSmartQuotesPlugin',
            'IceEmdashPlugin',
            {
              name: 'IceCopyPastePlugin',
              settings: {
                pasteType: 'formattedClean',
                preserve: 'ol,ul,li'
              }
            }
          ]
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
        this.onBlur();
      });
    });
  }

  ngOnDestroy() {
    this.changed.unsubscribe();
    this.selectionsSub.unsubscribe();
    this.onApproveSub.unsubscribe();
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
    this.comment.index = false;
    this.closeComment();
  }

  saveComment(index: false | number = false) {
    if (this.comment.index !== false) {
      this.comment.list[this.comment.index].content = this.comment.content;
    } else {
      const time = new Date().getTime();
      this.comment.list.push({
        content: this.comment.content,
        user: this.user,
        time,
        formattedTime: window.moment(time).format('MMM DD YYYY hh:mma')
      });
    }

    this.data.comments_json = this.comment.list;
    this.cancelComment();
    this.dataChanged.emit(this.data);
    this.changed.emit(this.data);
    setTimeout(_ => this.openComment(), 100);
  }

  onMouseEnter() {
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
  onClick() {
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

  onBlur() {
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

  setEndOfContenteditable(contentEditableElement) {
    let range: any;
    let selection: any;
    if (document.createRange) {
      range = document.createRange(); // Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement); // Select the entire contents of the element with the range
      range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); // get the selection object (allows you to change selection)
      selection.removeAllRanges(); // remove any selections already made
      selection.addRange(range); // make the range you have just created the visible selection
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(e: KeyboardEvent) {
    setTimeout(_ => {
      this.changed.emit(e);
    }, 100);
  }
}
