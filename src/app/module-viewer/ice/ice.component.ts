import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  TemplateRef,
  HostListener,
  ViewContainerRef,
  EventEmitter,
  Output
} from '@angular/core';
import User from 'src/app/common/interfaces/user.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription, fromEvent, BehaviorSubject } from 'rxjs';
import { filter, take, skip } from 'rxjs/operators';
import { IceService } from './ice.service';
import { DOCUMENT } from '@angular/common';
import { E3ConfirmationDialogService } from 'src/app/common/components/e3-confirmation-dialog/e3-confirmation-dialog.service';


@Component({
  selector: 'ice',
  templateUrl: './ice.component.html',
  styleUrls: ['./ice.component.sass']
})
export class IceComponent implements OnInit {
  @Input() hideChanges: boolean;
  @Input() user: User;
  @Input() box: number;
  @Input() disabled: boolean;
  @Input() data: {
    textContent: string;
    content: string;
    selections$: BehaviorSubject<string[]>;
    comments_json: any[];
  };
  @Input() allowRemoveSelections = false;

  @Output() changed = new EventEmitter(false);
  @Output() dataChanged = new EventEmitter(false);

  @ViewChild('commentOverlay') commentOverlay: TemplateRef<any>;

  tracker: any;
  overlayRef: OverlayRef | null;
  subs: Array<Subscription | null> = [];
  comment: { [key: string]: any; index: false | number } = {
    adding: false,
    content: '',
    list: [],
    editingIndex: 0,
    hasComment: false,
    show: false,
    index: false
  };
  menuComment: any;
  menuIndex: number;

  constructor(
    private el: ElementRef,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private iceService: IceService,
    private dialogService: E3ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.data = this.data || {
      textContent: '',
      content: '',
      comments_json: [],
      selections$: new BehaviorSubject([])
    };
    this.data.content = this.data.content || '';
    this.data.selections$ = this.data.selections$ || new BehaviorSubject([]);

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

    this.data.textContent = el.innerHTML;

    this.iceService.allComponents.push(this);

    if (this.data.comments_json && this.data.comments_json.length) {
      this.comment.list = this.data.comments_json;
      this.comment.hasComment = true;
    }
    const text = this.el.nativeElement.querySelector('#textbody');
    setTimeout(() => {
      const text = this.el.nativeElement.querySelector('#textbody');
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
        }
        ]
      }).startTracking();

      this.tracker = tracker;
      if (this.disabled) {
        this.tracker.element.contentEditable = 'false';
      }
      this.tracker.element.blur();
      this.iceService.onApprove.subscribe(() => {
        this.tracker.acceptAll();
        this.changed.emit();
      });
    });

    this.data.selections$.pipe(skip(1)).subscribe(_ => {
      this.onBlur();
      this.changed.emit();
    });
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
    this.openComment(this.commentPosition());
  }

  cancelComment() {
    this.comment.adding = false;
    this.comment.content = '';
    this.comment.index = false;
    this.closeComment();
  }

  saveComment(index: false | number = false) {
    this.comment.adding = false;
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

    this.comment.hasComment = !!this.comment.list.length;
    this.data.comments_json = this.comment.list;
    this.comment.index = false;
    this.comment.content = '';
    this.closeComment();
    this.changed.emit(null);
  }

  onMouseEnter() {
    if (this.comment.list && this.comment.list.length) {
      this.openComment(this.commentPosition());
    }
  }

  private commentPosition() {
    const rect = this.el.nativeElement
      .querySelector('#textbody')
      .getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.bottom
    };
  }

  private openComment({ x, y }) {
    this.iceService.closeAll();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(
      new TemplatePortal(this.commentOverlay, this.viewContainerRef, {
        $implicit: this.comment
      })
    );

    this.subs.push(
      fromEvent<MouseEvent>(document, 'click')
        .pipe(
          filter(event => {
            const clickTarget = event.target as HTMLElement;
            return (
              !!this.overlayRef &&
              !(
                this.overlayRef.overlayElement.contains(clickTarget) ||
                clickTarget.classList.contains(
                  'cdk-overlay-transparent-backdrop'
                ) ||
                clickTarget.id === 'addComment' ||
                (this.el.nativeElement as HTMLElement).contains(clickTarget)
              )
            );
          }),
          take(1)
        )
        .subscribe(() => this.closeComment())
    );

    this.subs.push(
      fromEvent<MouseEvent>(this.overlayRef.overlayElement, 'mouseleave')
        .pipe(
          filter((e: MouseEvent & { toElement: any }) => {
            const target = e.toElement || (e.relatedTarget as HTMLElement);
            return (
              !!this.overlayRef &&
              !this.overlayRef.overlayElement.contains(target)
            );
          }),
          take(1)
        )
        .subscribe(() => this.closeComment())
    );
    this.comment.show = true;
  }

  closeComment() {
    this.subs && this.subs.forEach(sub => sub.unsubscribe());
    this.comment.show = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(e) {
    if (
      this.overlayRef &&
      !this.overlayRef.overlayElement.contains(e.toElement || e.relatedTarget)
    ) {
      this.closeComment();
    }

  }

  @HostListener('click', ['$event'])
  onClick() {
    if (this.iceService.shouldShowWarning) {

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

    this.onBlur();
  }

  onBlur() {

    const { element } = this.tracker;

    const selections = this.data.selections$.value;

    this.data.content =
      (selections && selections.length
        ? '<p class="matrix-options">' +
          (selections || []).map(sel => '<span>' + sel + '</span>').join('') +
          '</p>'
        : '') + element.innerHTML.replace(/&nbsp;/g, ' ');

    this.dataChanged.emit(this.data);
    this.changed.emit(null);
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
      this.onBlur();
      this.changed.emit(e);
    }, 100);
  }
}

