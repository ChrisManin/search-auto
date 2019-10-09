import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  clientID: string = environment.SPTFY_ID;
  baseUrl: string = environment.SPTFY_URL;

  constructor(private http: HttpClient) { }

  search(queryString: string) {
    const URL = this.baseUrl + queryString;
    return this.http.get(URL);
  }
}
