import { Component, ElementRef } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'esri-search',
  template: '<div></div>',
  inputs: ['options']
})
export class SearchComponent {
  
  // The variable elRef is the DOM element reference of tag esri-search
  constructor(private elRef:ElementRef, private mapService:MapService) {}

  private search: any;
  
  // This variable will be assigned through the inputs: ['options']
  private options: Object;

  public ngOnInit(): void {
    this.search = this.mapService.createSearch(this.options, this.elRef.nativeElement.firstChild);
  }

  public ngAfterViewInit(): void {
    if (this.search) {
        this.search.startup();
    }
  }

  public setMap(map): void {
    if (this.search) {
      this.search.set('map', map);
    }
  }

  public ngOnDestroy(): void {
    if (this.search) {
      this.search.destroy();
    }
  }
}
