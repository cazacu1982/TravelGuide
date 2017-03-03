import { Component, Inject, NgZone, OnInit, ViewChild, ViewChildren, ElementRef, transition, animate, trigger, state } from '@angular/core';
import  { AppService } from './app.service';
//import { Observable } from 'rxjs/Observable';
import { HostListener} from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import 'rxjs/Rx';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }

})
export class AppComponent implements  OnInit {
  isHomeVisible = true;
  isAboutVisible = false;
  isContactVisible = false;

  public latitude: number;
  public  longitude: number;
  public  searchControl: FormControl;
  public  zoom: number;

  public status: any = {
    isFirstOpen: true,
    isOpen: false
  };

  private profiles: any[];
  // pager object
  pager: any = {};
  // pagedItems
  pagedItems: Array<any>;
  query: string;

  totalShare: number = 0;
  scrollTop: boolean;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(public appService: AppService, @Inject(DOCUMENT) private document: Document,private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {}

  ngOnInit() {
    this.getProfiles();
    this.scrollBackToTop();
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["geocode"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place:google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  onResize() {
    setTimeout(function(){
      window.dispatchEvent(new Event("resize"));
    }, 1);
    this.zoom = 14;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  @HostListener("window:scroll", [])

  scrollBackToTop () {
    let number = this.document.body.scrollTop;
    number > 50 ? (this.scrollTop = true) : (this.scrollTop = false);
  }

  backToTop() {
    this.document.body.scrollTop = 0;
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
        if(typeof newFiltered[i][prop] === 'string') {
          newFiltered[i][prop] = newFiltered[i][prop].toLowerCase();
        }
      }
      let filtered = newFiltered.filter((el) => {
        if (el.country === this.query.toLowerCase() === true) {
          return el.country === this.query.toLowerCase();
        }
        else {
          return el.region === this.query.toLowerCase();
        }
      });

      //console.log(this.pagedItems);
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
  sumCounts(count){
    this.totalShare += count;
  }
 updateLikes(profiles_id) {

   this.appService.updateLikes(profiles_id).subscribe(
     data => {
       // refresh the list
       this.getProfiles();
       return true;
     });
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
