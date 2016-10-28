import { Injectable }     from '@angular/core';
import { Observable }     from "rxjs";
import { AppComponent }   from './app.component';
import { IDonor }         from './models';

import arcgisUtils        = require('esri/arcgis/utils');
import Search             = require('esri/dijit/Search');
import Point              = require("esri/geometry/Point");
import Graphic            = require("esri/graphic"); 
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import InfoTemplate       = require("esri/InfoTemplate");
import Locator            = require("esri/tasks/locator");
import SimpleLineSymbol   = require("esri/symbols/SimpleLineSymbol");
import Color              = require("esri/Color");
import webMercatorUtils   = require("esri/geometry/webMercatorUtils");



@Injectable()
export class MapService {
    private defaultSymbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_CIRCLE,
          15,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 255, 0.5]),
            8
          ),
          new Color([0, 0, 255])
        );
  
    // load a web map and return response
    public createMap(itemIdOrInfo: any, domNodeOrId: any, options: Object): any {
      return arcgisUtils.createMap(itemIdOrInfo, domNodeOrId, options);
    };
  
    // create a search dijit at the dom node
    public createSearch(options: Object, domNodeOrId: any): any {
      return new Search(options, domNodeOrId);
    }
  
  
    public clickOnLocation(map: any, callbackForMapClick: Function, callbackForGraphicsClick: Function): void {
        var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
        var addressLocation = null;
      
        locator.on("location-to-address-complete", function(evt) {
          if (evt.address.address) {
            addressLocation = evt.address;
            var location = webMercatorUtils.geographicToWebMercator(addressLocation.location);
            var graphic = new Graphic(location, this.defaultSymbol);
            map.graphics.add(graphic);
            callbackForMapClick(location, addressLocation.address);
          }
        });

        map.on("click", function(evt) {
            if (!evt.graphic) {
                if (map.graphics && map.graphics.graphics) {
                    for (let entry of map.graphics.graphics) {
                        if (!entry.attributes) {
                            map.graphics.remove(entry);
                            break;
                        }
                    }
                }
                
                locator.locationToAddress(evt.mapPoint, 400);
            }
        });

        if (map.graphics) {
            map.graphics.on("click", function(evt) {
                callbackForGraphicsClick(evt.graphic.attributes);
            });
        }
    }
  
  
    // Creating a point at map representing a Doner
    public createPoint(map: any, donor: IDonor): void {
        console.log("Creating donor");
        console.log(donor);
        var pt = new Point(donor.location.x, donor.location.y, donor.location.spatialReference);
        map.graphics.add(new Graphic(pt, this.defaultSymbol, donor));
    }
  
  
    // Remove a point
    public deletePoint(map: any, donor: IDonor): void {
        console.log("deleting");
        console.log(donor);
        if (map.graphics && map.graphics.graphics) {
            for (let entry of map.graphics.graphics) {
                if (entry.attributes && entry.attributes.emailAddress == donor.emailAddress) {
                    map.graphics.remove(entry);
                    break;
                }
            }
        }
    }
}
