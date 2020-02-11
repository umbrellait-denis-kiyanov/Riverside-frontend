export interface AccountProfile {
  fname: string;
  lname: string;
  email: string;
}

export interface UpdatePassword {
  curPwd: string;
  newPwd: string;
  newPwd2: string;
}

export interface PresignedProfilePictureUrl {
  url: string;
  key: string;
}
