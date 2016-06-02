// requests.service.ts

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';

import { User } from './user.model';

@Injectable()
export class AuthService {
  authUser: User;
  API_ENDPOINT: string = "https://aswwu.com/server/";

  constructor(private http: Http) { }

  private createRequest(uri: string): any {
    let url = this.API_ENDPOINT;
    if (url.split('').pop() != '/' && uri[0] != '/') url += '/';
    url += uri;

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'HMAC '+this.getToken()
    });
    let options = new RequestOptions({ headers: headers });

    return { url: url, options: options };
  }

  private logError(err): void {
    console.error(err);
  }

  private setAuth(data): void {
    let token = data.token || '';
    window.localStorage.setItem('token', token);
    this.setUser(data.user);
  }

  private getToken(): string {
    let token = window.localStorage.getItem('token') || '';
    return token;
  }

  private setUser(data: any): void {
    try {
      data = JSON.parse(data);
    } catch(e) { }
    if (data) {
      if (data.user) {
        data = data.user;
      }
      this.authUser = new User(data);
    }
  }

  get(uri: string, afterRequest, catchError): void {
    let req = this.createRequest(uri);
    this.http.get(req.url, req.options)
      .map(res => res.json())
      // .catch(err => (catchError ? catchError(err) : this.logError(err)))
      .subscribe(
        data => afterRequest(data),
        err => (catchError ? catchError(err) : this.logError(err))
      );
  }

  post(uri: string, data: any, afterRequest, catchError): void {
    if (typeof data == "object") {
      for (var key in data) {
        data[key] = [data[key]];
      }
    }
    let body = JSON.stringify(data);
    let req = this.createRequest(uri);
    this.http.post(req.url, body, req.options)
      .map(res => res.json())
      .subscribe(
        data => afterRequest(data),
        err => (catchError ? catchError(err) : this.logError(err))
      );
  }

  login(username: string, password: string): void {
    this.post("login", {username: username, password: password}, data => {
      this.setAuth(data);
      window.history.back(); // TODO: check previous URL before going there
    }, null);
  }

  logout(): void {
    window.localStorage.clear();
    this.authUser = undefined;
  }

  getUser(): User {
    if (!this.authUser) {
      this.verify();
    }
    return this.authUser;
  }

  verify(): void {
    if (this.getToken().length > 0) {
      this.get("verify", data => this.setUser(data), err => this.setAuth({}));
    } else {
      this.setAuth({});
    }
  }
}
