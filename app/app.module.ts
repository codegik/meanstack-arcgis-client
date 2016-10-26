import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';
import { TextMaskModule }     from 'angular2-text-mask';

import { MapComponent }       from './map.component';
import { SearchComponent }    from './search.component';
import { AppComponent }       from './app.component';
import { ModalComponent }     from './modal.component';
import { IamdonerComponent }  from './iamdoner.component';
import { MapService }         from './map.service';
import { SocketService }      from './socket.service';


@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [ 
    AppComponent, 
    MapComponent, 
    SearchComponent,
    ModalComponent,
    IamdonerComponent
  ],
  providers: [
    MapService,
    SocketService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
