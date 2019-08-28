import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { STATUS } from './status.enum';

import { Recorder } from 'vmsg';
import { HttpClient } from '@angular/common/http';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.sass']
})
export class AudioRecorderComponent implements OnInit {
  @Output() finish = new EventEmitter<string>(false);
  @ViewChild('audioOption') audioPlayerRef: ElementRef;

  STATUS = STATUS;
  status: STATUS;
  errorMsg: string;
  recorder: Recorder;
  blob: Blob;
  audioSrc: string;
  ext = 'mp3';

  redoIcon = faRedoAlt;

  constructor(
    private http: HttpClient

  ) { }

  ngOnInit() {
    this.status = STATUS.TESTING;
    this.recorder = new Recorder({
      wasmURL: '/public/ngapp/node_modules/vmsg/vmsg.wasm'
    });
    this.recorder.init()
      .then(() => {
        this.status = STATUS.READY;
      })
      .catch(reason => {
        this.errorMsg = reason;
        this.status = STATUS.TEST_ERROR;
      });
  }

  toggleRecording() {
    if (this.status !== STATUS.RECORDING) {
      this.recorder.startRecording();
      this.status = STATUS.RECORDING;
    } else {
      this.status = STATUS.PROCESSING;
      this.recorder.stopRecording().then(blob => {
        this.status = STATUS.RECORDED;
        this.blob = blob;
      });
    }

  }

  play() {
    this.blobToDataURL(this.blob, (url: string) => {
      this.audioSrc = url;
      setTimeout(() => {
        this.audioPlayerRef.nativeElement.play();
      });
      this.status = STATUS.PLAYING;
    });
  }

  blobToDataURL(blob: Blob, callback: any) {
    const a = new FileReader();
    a.onload = (e: any) => { callback(e.target.result); };
    a.readAsDataURL(blob);
  }

  stop() {
    this.status = STATUS.RECORDED;

  }

  upload() {
    this.status = STATUS.UPlOADING;
    this.getPresignedUrl().then((res: any) => {
      const {url, key} = res;
      this.http.put(url, this.blob).toPromise().then(() => {
        this.finish.emit(key);
        this.status = STATUS.DONE;
      }).catch(() => {
        this.status = STATUS.ERROR;

      });
    });
  }

  getPresignedUrl() {
    return this.http.get('/api/modules/0/feedback/presignedurl?ext=' + this.ext)
      .toPromise();
  }

  showUI() {
    return this.status !== STATUS.TESTING &&
           this.status !== STATUS.TEST_ERROR &&
           this.status !== STATUS.UPlOADING &&
           this.status !== STATUS.DONE;
  }
}
