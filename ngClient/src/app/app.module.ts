import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AccordionModule } from 'ng2-bootstrap/accordion';
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
    HttpModule,
    AccordionModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
