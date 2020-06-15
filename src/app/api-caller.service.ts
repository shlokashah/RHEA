import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Env } from './models/env.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {

  baseUrl: string = Env.baseUrl;

  constructor(private _http: HttpClient) { }

  doGetRequest(url: string): Observable<any> {
    url = this.baseUrl + url;
    return this._http.get(url).pipe(map(
      res =>res
    ));
  }

  doPostRequest(url: string, postBody:any): Observable<any> {
    url = this.baseUrl + url;
    return this._http.post(url, postBody).pipe(map(
      res => res
    ));
  }

}
