import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }
  url = 'http://localhost:3000';


  getData(key = 'opt') {
    return this
      .http
      .get<any>(`${this.url}/${key}`)
      .pipe(map(ddd => {
        console.log(ddd);
        return ddd;
      }));
  }
  sendData(key = 'opt') {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .post<any>(`${this.url}/${key}`, { n: 1 }, options)
      .pipe(map(ddd => {
        console.log(ddd);
        return ddd;
      }));
  }
}
/*  postResult() {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .post<{
        name: String, id: number,
        movies: number
      }>(`${this.url}/results`, { id: 6, name: 'Colin', movies: 0 }, options)
      .pipe(map(
        console.log(ddd);
        return ddd;
      }));
  }
  postType(n: number = 20, type: string = 'short', factorWant: number[] = []) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .post<{
        n: number,
        type: string,
        factorWant: number[]
      }>(`${this.url}/optype`, { n: n, type: type, factorWant: factorWant}, options)
      .pipe(map(ddd => {
        console.log(ddd);
        return ddd;
      }));
  }
  putResult(key = 'results', id = 6) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .put<{
        name: String, id: number,
        movies: number
      }>(`${this.url}/${key}/${id}`, { id: id, name: 'Colin', movies: Math.floor(Math.random() * 200) }, options)
      .pipe(map(ddd => {
        console.log(ddd);
        return ddd;
      }));
  }
  */

