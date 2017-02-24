import { Component } from '@angular/core';
import  { AppService } from './app.service';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHomeVisible = true;
  isAboutVisible = false;
  isContactVisible = false;

  public status: any = {
    isFirstOpen: true,
    isOpen: false
  };
  private profiles: any[];
  // pager object
  pager: any = {};
  // pagedItems
  pagedItems: any[];
  query: string;

  constructor(public appService: AppService) {}

  ngOnInit() {
    this.getProfiles();
  }

  getLogin() {
    this.appService.getLogin();
  }
  getSignup() {
    this.appService.getSignup();
  }
  getProfiles(){
    this.appService.getProfiles().subscribe(
      data => {
        this.profiles = data
          //.filter((el) => { return el.profile; })
          .reverse();
        this.setPage(1);
         //error => console.log(error)
      });
  }

  search() {
    if (this.query.length <= 0) {
      return;
    } else {
     let Obj = this.profiles;

      let newFiltered = Obj.map(el => el);

      for (var i = 0; i < newFiltered.length; i++) {
        for (var prop in newFiltered[i])
          // condition here
          newFiltered[i][prop] = newFiltered[i][prop].toString().toLowerCase();
      }

      let filtered = newFiltered.filter((el) => {
        if (el.country === this.query.toLowerCase() === true) {
          return el.country === this.query.toLowerCase()
        }
        else {
          return el.region === this.query.toLowerCase();
        }
      });
      return this.pagedItems = filtered;
    }
  };
  reset() {
    this.query = '';
    this.getProfiles();
  }
  sendMail() {
    this.appService. sendMail();
   }
  setPage (page: number) {
    if(page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.appService.getPager(this.profiles.length, page);
    this.pagedItems = this.profiles.slice(this.pager.startIndex, this.pager.endIndex  + 1);
    //{console.log(this.pager.totalPages)}
  }

  isHome() {
    this.isHomeVisible = true;
    this.isContactVisible =false;
    this.isAboutVisible = false;
  }
  isAbout() {
    this.isAboutVisible = true;
    this.isHomeVisible = false;
    this.isContactVisible =false;
  }
  isContact() {
    this.isContactVisible =true;
    this.isHomeVisible = false;
    this.isAboutVisible = false;
  }
}
