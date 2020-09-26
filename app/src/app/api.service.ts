import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static post(arg0: string) {
    throw new Error("Method not implemented.");
  }
  private baseUrl = "https://vnpt.fastlms.vn/";
  constructor(private http:HttpClient) {}

  public get(api, data, auth) {
    return this.http.get(this.baseUrl + api, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', ...auth })
    });
  }
  public put(api, data, auth) {
    let body = JSON.stringify(data)
    return this.http.put(this.baseUrl + api, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', ...auth })
    });
  }
  public post(api, data, auth) {
    let body = JSON.stringify(data)
    return this.http.post(this.baseUrl + api, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', ...auth })
    });
  }
  public delete(api, auth) {
    return this.http.delete(this.baseUrl + api, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', ...auth })
    });
  }
  //add covid
  public covid19Rp():any {
    let urls = 'https://corona.lmao.ninja/v3/covid-19/countries';
    return this.http.get(urls);
  }
  public covid19Gets(api, data, auth) {
    return this.http.get('https://corona.lmao.ninja/v3/covid-19/countries');
  }
  //end covid
}
