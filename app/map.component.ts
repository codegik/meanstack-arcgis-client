import { Component, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IDonor, IResponse }  from './models';
import { ModalComponent }     from './modal.component';
import { MapService }         from './map.service';
import { SearchComponent }    from './search.component';
import { SocketService }      from './socket.service';


@Component({
  selector: 'esri-map',
  templateUrl: `app/map.component.html`,
  inputs: ['options', 'itemId']
})
export class MapComponent {
    @ViewChild('registerDonorModal') registerDonorModal: ModalComponent;
    @ViewChild('viewDonorModal') viewDonorModal: ModalComponent;
    @ViewChild('unsubscribeModal') unsubscribeModal: ModalComponent;
    @ViewChild('successModal') successModal: ModalComponent;
    @ViewChild('failModal') failModal: ModalComponent;
    @ViewChild(SearchComponent) searchComponent:SearchComponent;
    @Output() mapLoaded = new EventEmitter();
  
    public emailAddressDisplay: boolean = false;
    public contactNumberDisplay: boolean = false;
    public contactMask = {mask: ['+', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/], guide: true };
  
    private map: any;
    private socket: any;

    // This two variables will be assigned through the inputs: ['options', 'itemId']
    private options: Object;
    private itemId: string;
  
    // For register new donor
    public donor: IDonor = {_id: null,ip: '',firstName: '',lastName: '',contactNumber: '',emailAddress: '',bloodGroup: '',address: {Address:''},location: {}};
    // For represent current user
    public myRegister: IDonor;
    // For represent a viewed donor
    public viewDonor: IDonor;
    
    // This variable is passed as a configuration to the SearchComponent through the app/app.component.html file
    public searchOptions = {
        enableButtonMode: false,
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
    };
  
    // The variable elRef is the DOM element reference of tag esri-map
    constructor(
        private elRef:ElementRef, 
        private mapService:MapService, 
        private socketService: SocketService) {}


    // On ng init create the map
    public ngOnInit(): void {
        // Create a map and expose the object to app through the EventEmitter
        this.mapService.createMap(this.itemId, this.elRef.nativeElement.firstChild, this.options).then((response) => {
            this.mapLoaded.next(response);
        });
    }
  
  
    // On map is loaded
    public loaded(response): void {
        this.map = response.map;
        this.searchComponent.setMap(this.map);
        
        // Connect to server and handle responses
        this.socket = this.socketService.open();
        this.handleResponse();
      
        this.mapService.clickOnLocation(this.map, 
          (location: any, address: any) => this.clickOnLocation(location, address), 
          (donor: IDonor) => this.clickOnDoner(donor)
       );
      
        this.findDonors(0, 0);
      
        this.findMyRegister();
    }
  

    // Handle all responses
    public handleResponse(): void {
        this.socket.on("findedDonorsResponse", (donors: IDonor[]) => this.findedDonorsResponse(donors) );
        this.socket.on("findMyRegisterResponse", (donor: IDonor) => this.findMyRegisterResponse(donor) );
        this.socket.on("addedDonorResponse", (response: IResponse) => this.addedDonorResponse(response) );
        this.socket.on("addedDonor", (donor: IDonor) => this.addedDonor(donor) );
        this.socket.on("updatedDoner", (donor: IDonor) => this.updatedDoner(donor) );
        this.socket.on("unsubscribed", (donor: IDonor) => this.unsubscribed(donor) );
    }

  
    public ngOnDestroy(): void {
        if (this.map) {
            this.map.destroy();
        }
    }
  
  
    private clickOnLocation(location: any, address: any): void {
        if (!this.myRegister && address) {
            this.donor = {
                _id: null,
                ip: '',
                firstName: '',
                lastName: '',
                contactNumber: '',
                emailAddress: '',
                bloodGroup: '',
                address: address,
                location: location
            };
            this.registerDonorModal.show();
        }
    }
  
  
  
    private clickOnDoner(donor: IDonor): void {
        if (donor) {
            this.viewDonor = donor;
            this.viewDonorModal.show();
        }
    }
  
  
    public editRegister(): void {
        if (this.myRegister) {
            this.donor = this.myRegister;
            this.registerDonorModal.show();
        }
    }
  
    // Request to find a list of donors
    public findDonors(lat: number, log: number): void {
        this.socket.emit("findDonors", lat, log);
    }
  
    // Request to find the user register
    public findMyRegister(): void {
        this.socket.emit("findMyRegister");
    }
    
    // Request to unsubscribe the user register
    public unsubscribe(): void {
        if (this.myRegister) {
            this.socket.emit("unsubscribe", this.myRegister);
        }
    }
  
    // Request to add new donor
    public addDonor(): void {
        if (this.donor._id) {
            this.socket.emit("updateDonor", this.donor);
        } else {
            this.socket.emit("addDonor", this.donor);
        }
    }
  
    private findMyRegisterResponse(donor: IDonor): void {
        if (donor) {
            this.myRegister = donor;
        }
    }
  
  
    private findedDonorsResponse(donors: IDonor[]): void {
        this.map.graphics.clear();
        for (let entry of donors) {
            this.addedDonor(entry);
        }
    }

  
    private addedDonor(donor: IDonor): void {
        this.mapService.createPoint(this.map, donor);
    }

  
    private updatedDoner(donor: IDonor): void {
        this.mapService.deletePoint(this.map, donor);
        this.mapService.createPoint(this.map, donor);
    }

  
    private unsubscribed(donor: IDonor): void {
        this.mapService.deletePoint(this.map, donor);
        this.unsubscribeModal.hide();
        this.myRegister = null;
    }
  
  
    private addedDonorResponse(response: IResponse) {
        if (response.error) {
            this.failModal.show();
        } else {
            this.registerDonorModal.hide();
            this.successModal.show();
        }
    }
}
