import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // api server
 // public URL = 'http://0.0.0.0:3000/api/v1/';

  public URL = 'http://0.0.0.0:3002/';
  constructor(public http: HttpClient, private authenticatinService: AuthenticationService) {
  }


  signIn(user): Observable<any> {
    console.log('Sign In User: ', user);
    return this.http
      .post(`${this.URL}login`, user)
      
  }

  signUp(user): Observable<any> {
    return this.http
      .post(`${this.URL}signup`, user)
      .pipe(
        (map(response => response)),
        catchError((error: any) => of(error))
      );
  }

  me(): Observable<any> {
    return this.http
      .get(`${this.URL}me`)
      .pipe(
        (map(response => response)),
        catchError((error: any) => of(error))
      );
  }
}
