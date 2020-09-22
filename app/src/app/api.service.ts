import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "https://vnpt.fastlms.vn/";
  constructor(private http:HttpClient) {}

  public get(api, data) {
    return this.http.get(this.baseUrl + api, httpOptions);
  }
  public put(api, data) {
    let body = JSON.stringify(data)
    return this.http.put(this.baseUrl + api, body, httpOptions);
  }
  public post(api, data) {
    let body = JSON.stringify(data)
    return this.http.post(this.baseUrl + api, body, httpOptions);
  }
  public delete(api, data) {
    return this.http.delete(this.baseUrl + api, httpOptions);
  }
}
