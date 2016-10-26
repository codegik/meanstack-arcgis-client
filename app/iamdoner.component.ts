import { Component, ElementRef } from '@angular/core';


@Component({
  selector: 'app-iamdoner',
  template: 
  `
  <div class="iamdoner-indicator fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div>
      <div class="alert alert-info">
        <ng-content select=".app-iamdoner-body"></ng-content>
      </div>
    </div>
  </div>
  `
})
export class IamdonerComponent {

  public visible = true;
  private visibleAnimate = true;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
}