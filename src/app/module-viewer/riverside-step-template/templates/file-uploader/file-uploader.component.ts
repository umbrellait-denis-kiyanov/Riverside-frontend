import {Component, ElementRef, forwardRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TemplateComponent} from '../template-base.class';
import {FileUploaderTemplateData, TemplateParams} from '.';
import { faFileExcel , faFileImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => FileUploaderComponent) }]
})
export class FileUploaderComponent extends TemplateComponent {

  @ViewChild('customFile') fileInput: ElementRef;

  contentData: FileUploaderTemplateData['template_params_json'];
  params = TemplateParams;

  availableFileTypes = [
    'image/jpeg',
    'image/png',
    'text/csv'
  ];

  isFileChosen = false;
  fileName = '';
  sizeSuffix = 'KB';
  fileSize = 0;
  faFileExcelIcon = faFileExcel;
  faFileImageIcon = faFileImage;
  imgURL: any;

  getDescription(): string {
    return 'File uploader';
  }

  getName(): string {
    return 'File uploader';
  }

  hasInputs(): boolean {
    return true;
  }

  protected init() {

    this.contentData = this.data.data.template_params_json as FileUploaderTemplateData['template_params_json'];

  }

  onFileSectionClick() {
    this.fileInput.nativeElement.click();
  }

  onDrop($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    const { dataTransfer } = $event;

    if (dataTransfer.files.length === 1 && this.availableFileTypes.indexOf(dataTransfer.files[0].type) !== -1) {
      this.fileInput.nativeElement.files = dataTransfer.files;
      this.isFileChosen = true;
      this.fileName = dataTransfer.files[0].name;
      this.fileSize = dataTransfer.files[0].size / 1024;
      if ( this.fileSize >= 1024 ) {
        this.sizeSuffix = 'MB';
        this.fileSize /= 1024;
      } else {
        this.sizeSuffix = 'KB';
      }
      console.log(this.fileInput.nativeElement.files);
    } else {
      alert('Only one file with type: ' + this.availableFileTypes);
    }
  }

  removeFileToUpload($event: MouseEvent) {
    $event.stopPropagation();
    this.isFileChosen = false;
    // this.fileInput.nativeElement.files = new FileList();
  }

  onFileChange() {
    const reader = new FileReader();
    if ( this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length === 1) {
      const file = this.fileInput.nativeElement.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgURL = reader.result;
        this.isFileChosen = true;
        if (typeof reader.result === 'string') {
          console.log({
            filename: file.name,
            filetype: file.type,
            value: reader.result.split(',')[1]
          });
        }
      };
    }
  }
}
