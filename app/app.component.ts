import { Component, ViewChild } from '@angular/core';
import { MapComponent }         from './map.component';
import { IamdonerComponent }    from './iamdoner.component';

@Component({
    selector: 'app',
    templateUrl: `app/app.component.html`
})
export class AppComponent {
    @ViewChild(IamdonerComponent) iamdonerComponent:IamdonerComponent;
    @ViewChild(MapComponent) mapComponent:MapComponent;
  
    // This tree variables are configured at ArcGIS Online
    public title = '';
    public itemId = '9e845b1caf564cf0b7bdf29dab5a66da';
    public mapOptions = {
        basemap: 'osm',
        center: [-51.1994945, -30.0555806],
        zoom: 15
    };
  
    // When component is loaded at app/app.component.html this event will execute
    // The 'response' argument is an object received from ArcGIS API
    public onMapLoad(response): void {
        this.title = response.itemInfo.item.title;
        this.mapComponent.loaded(response);
    }
 
    public myRegister: boolean = false;
}