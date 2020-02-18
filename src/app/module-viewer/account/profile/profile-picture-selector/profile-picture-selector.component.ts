import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { UserService } from "src/app/common/services/user.service";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { PresignedProfilePictureUrl } from "src/app/common/interfaces/account.interface";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "profile-picture-selector",
  templateUrl: "./profile-picture-selector.component.html",
  styleUrls: ["./profile-picture-selector.component.sass"]
})
export class ProfilePictureSelectorComponent implements OnInit {
  imageChangedEvent: string = "";
  croppedImage: string = "";
  @Output() imageUploaded = new EventEmitter();

  saving: Subscription = null;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  fileChangeEvent(event: string): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  dataURItoBlob(dataURI: string) {
    const binary = atob(dataURI.split(",")[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  }

  upload() {
    const type = this.croppedImage.split(";")[0].split("/")[1];

    this.userService.presignedProfilePictureUpload(type).subscribe(
      (res: PresignedProfilePictureUrl) => {
        const { url, key } = res;
        const buffer = this.dataURItoBlob(this.croppedImage);
        this.saving = this.http
          .put(url, buffer, {
            headers: {
              "Content-Type": "image/" + type,
              "Content-Encoding": "base64"
            }
          })
          .pipe(first())
          .subscribe(() => {
            this.imageUploaded.emit(key);
          });
      },
      e => {
        if (
          e.error &&
          e.error.failure &&
          e.error.failure === "INVALID_EXTENSION"
        ) {
          this.toastr.error("Invalid file extension");
        } else {
          this.toastr.error("Could not upload picture");
        }
      }
    );
  }
}
