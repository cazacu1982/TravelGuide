import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  'rxjs/add/operator/map';

var _ = require('underscore')._;

@Injectable()
export class AppService {

  private headers = new Headers({ 'content-type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });


  constructor( public http: Http ) { }
  getLogin() {
    return window.location.href='http://localhost:3000/login';
  }
  getSignup() {
    return window.location.href='http://localhost:3000/signup';
  }
  getProfiles(): Observable<any> {
    return this.http.get('http://localhost:3000/profiles').map(res => res.json());
  }
  sendMail() {
    return location.href = 'mailto:cazacu1982@yahoo.com';
  }
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 3) {
    let totalPages = Math.ceil(totalItems/pageSize);

    let startPage: number, endPage: number;
    if(totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if(currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if(currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    let pages = _.range(startPage, endPage + 1);
    
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages

    }

  }

}
