import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:HttpClient) {}

  get(api, data) {
    return this.http.get(api, httpOptions);
  }
  put(api, data) {
    let body = JSON.stringify(data)
    return this.http.put(api, body, httpOptions);
  }
  post(api, data) {
    let body = JSON.stringify(data)
    return this.http.post(api, body, httpOptions);
  }
  delete(api, data) {
    return this.http.delete(api, httpOptions);
  }
}
