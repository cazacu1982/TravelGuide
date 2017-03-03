import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { CarouselModule } from 'ng2-bootstrap/carousel';
import {ShareButtonsModule} from 'ng2-sharebuttons';
import { ModalModule } from 'ng2-bootstrap/modal';
import { AgmCoreModule } from "angular2-google-maps/core";
import { DatepickerModule } from 'ng2-bootstrap/datepicker';

//import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import  { AppService } from './app.service';
import { AppPipe } from './app.pipe';


@NgModule({
  declarations: [
    AppComponent,
    AppPipe
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    ShareButtonsModule.forRoot(),
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCmUeMaQ8qHH4j6s8SE7Y2mUoUAm0WFxrM",
      libraries: ["places"]
    }),
    DatepickerModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
