import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'feedback-source',
  templateUrl: './feedback-source.component.html',
  styleUrls: ['./feedback-source.component.sass']
})
export class FeedbackSourceComponent implements OnInit {
  @Output() messageChanged = new EventEmitter();
  @Output() currentTabChanged = new EventEmitter();

  @Output() submit = new EventEmitter<string>(false);

  public Editor = InlineEditor;
  tabs = ['text', 'video', 'audio'];
  activeTabIndex = 0;

  _message: string = '';
  get message() {
    return this._message;
  }

  set message(msg: string) {
    this._message = msg;
    this.messageChanged.emit(msg);
  }

  _currentTab: string = 'text';
  get currentTab() {
    return this._currentTab;
  }

  set currentTab(msg: string) {
    this._currentTab = msg;
    this.currentTabChanged.emit(msg);
  }

  get videoTabIndex() {
    return this.tabs.indexOf('video');
  }

  get activeTab() {
    return this.tabs[this.activeTabIndex];
  }

  constructor() {}

  ngOnInit() {
    this.currentTabChanged.emit(this.activeTab);
  }

  submitVideo(url: string) {
    this.message = `<div style="text-align: center">
      <video src="${url}" controls>
    </div>`;
    this.submit.emit(this.message);
  }

  submitAudio(url: string) {
    this.message = `<div style="text-align: center">
      <audio src="${url}" controls>
    </div>`;
    this.submit.emit(this.message);
  }

  handleTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.currentTab = this.activeTab;
    this.currentTabChanged.emit(this.currentTab);
  }
}
