import {Component, ElementRef, forwardRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {TemplateComponent} from '../template-base.class';
import {FileUploaderTemplateData, TemplateParams} from '.';
import { faFileExcel , faFileImage } from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => FileUploaderComponent) }]
})
export class FileUploaderComponent extends TemplateComponent {

  @ViewChild('customFile') fileInput: ElementRef;
  toastr: ToastrService;

  contentData: FileUploaderTemplateData['template_params_json'];
  params = TemplateParams;

  availableImagesTypes = [
    'image/jpeg',
    'image/png'
  ];

  availableSpreadsheetTypes = [
      'text/csv'
  ];

  isFileChosen = false;
  fileName = '';
  sizeSuffix = 'KB';
  fileSize = 0;
  faFileExcelIcon = faFileExcel;
  faFileImageIcon = faFileImage;
  imgURL: any;
  fileObjectToUpload: {
    filename: string,
    filetype: string,
    value: any
  };

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
    this.toastr = this.injectorObj.get(ToastrService);
  }

  onFileSectionClick() {
    this.fileInput.nativeElement.value = null;
    this.fileInput.nativeElement.click();
  }

  onDrop($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    const { dataTransfer } = $event;

    if (dataTransfer.files.length === 1 && this.isFileExtensionValid(dataTransfer.files[0])) {
      this.fileInput.nativeElement.files = dataTransfer.files;
      this.isFileChosen = true;
      this.formatFileInfo(this.fileInput.nativeElement.files[0]);
      this.prepareFileToUpload(this.fileInput.nativeElement.files[0]);
    } else {
      this.toastr.error('File format is incorrect');
    }
  }

  removeFileToUpload($event: MouseEvent) {
    $event.stopPropagation();
    this.isFileChosen = false;
  }

  onFileChange() {

    const files = this.fileInput.nativeElement.files;

    if ( files && files.length === 1 && this.isFileExtensionValid(files[0])) {
      this.formatFileInfo(files[0]);
      this.prepareFileToUpload(files[0]);
    } else {
      if ( this.contentData.step_select === 'Image' ) {
        this.toastr.error('File format is incorrect! Only images!');
      } else {
        this.toastr.error('File format is incorrect! Only csv spreadsheets!');
      }

    }
  }

  formatFileInfo(file: File) {
    this.fileName = file.name;
    this.fileSize = file.size / 1024;
    if ( this.fileSize >= 1024 ) {
      this.sizeSuffix = 'MB';
      this.fileSize /= 1024;
    } else {
      this.sizeSuffix = 'KB';
    }
  }

  isFileExtensionValid(file: File): boolean {
    if ( this.contentData.step_select === 'Image' ) {
      return this.availableImagesTypes.indexOf(file.type) !== -1;
    }
    return this.availableSpreadsheetTypes.indexOf(file.type) !== -1;
  }

  prepareFileToUpload(file: File) {

    const reader = new FileReader();
    this.isFileChosen = true;
    reader.readAsDataURL(file);

    reader.onload = () => {
      if ( this.contentData.step_select === 'Image' ) {
        this.imgURL = reader.result;
      } else {
        this.imgURL = null;
      }
      if (typeof reader.result === 'string') {
        this.fileObjectToUpload = {
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        };
      }
    };
  }

}
