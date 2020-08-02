import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AppService {

  constructor(private http: HttpClient) {
  }

  extractData(res: any) {
    let body = res;
    return body || {};
  }

  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error("handleError function:", error); // log to console instead
      return throwError(error.error);
    };
  }

  get(apiPath: any): Observable<any[]> {
    return this.http.get(apiPath).pipe(
      map(this.extractData),
      catchError(this.handleError<any>("Error in get api"))
    );
  }
}
