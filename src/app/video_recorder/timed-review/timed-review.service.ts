import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Source } from "./source.interface";
import { environment } from "src/environments/environment";
import { postEndpoint } from "./timed-review.constants";
import { Submit } from "./submit.interface";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class TimedReviewService {
  constructor(private http: HttpClient) {}

  postSource(source: Source) {
    return this.http.post<{ key: string }>(
      `${environment.serverUrl}/render`,
      source,
      httpOptions
    );
  }

  postSubmit(data: Submit) {
    return this.http.post<{ success: boolean }>(
      postEndpoint,
      data,
      httpOptions
    );
  }
}
