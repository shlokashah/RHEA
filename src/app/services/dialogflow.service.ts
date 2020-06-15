import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Env } from '../models/env.prod';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DialogflowService {

  private baseURL: string = "https://dialogflow.googleapis.com/v2/projects/rhea-dbjpfy/agent/sessions/12345:detectIntent";
  private accessToken: string;

  constructor(private http: HttpClient){
    this.getToken();
  }

  public getToken() {
    return this.http.get('http://localhost:4000/token').subscribe((res:any) => {
      this.accessToken = res.token;
    })
  }

  public getResponse(query: string): Observable<any> {
    let data = {
      queryInput: {
        text: {
          text: query,
          languageCode: 'en-US'
        }
      }
    }
    return this.http
      .post(`${this.baseURL}`, data, { headers: this.getHeaders() })
      .pipe(map(res => res));
  }

  public getHeaders(){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${this.accessToken}`)
      .set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

}
    