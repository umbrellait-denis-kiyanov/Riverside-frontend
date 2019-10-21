import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/common/services/user.service';
import toastr from 'src/app/common/lib/toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'profile-picture-selector',
  templateUrl: './profile-picture-selector.component.html',
  styleUrls: ['./profile-picture-selector.component.sass']
})
export class ProfilePictureSelectorComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @Output() imageUploaded = new EventEmitter();

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  dataURItoBlob(dataURI: string) {
      const binary = atob(dataURI.split(',')[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  upload() {

    this.userService.presignedProfilePictureUpload('png').subscribe(
      (res: any) => {
        const {url, key} = res;
        const type = this.croppedImage.split(';')[0].split('/')[1];
        const buffer = this.dataURItoBlob(this.croppedImage);
        this.http.put(url, buffer, {headers: {
          'Content-Type': 'image/' + type,
          'Content-Encoding': 'base64'
        }}).subscribe(() => {
          this.imageUploaded.emit(key);
        });
      }
      ,
      () => {
        toastr.error('Could not upload picture');
      }
    );
  }
}
