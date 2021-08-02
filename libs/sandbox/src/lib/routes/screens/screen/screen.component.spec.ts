import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ScreenComponent } from "./screen.component";
import { of } from "rxjs";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { DefaultViewerComponent } from "../../../shared/dynamic/components/default-viewer.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

describe('ScreenComponent', () => {
  let component: ScreenComponent;
  let fixture: ComponentFixture<ScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenComponent, DefaultViewerComponent],
      providers: [{
        provide: ActivatedRoute, useValue: {
          url: of([new UrlSegment("#/creation/screens/aa", {})]),
          snapshot: {
            url: [new UrlSegment("#/creation/screens/aa", {})]
          }
        }
      }]

    }).overrideModule(BrowserDynamicTestingModule, {set: {entryComponents:[DefaultViewerComponent]}})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should created', () => {
    expect(component).toBeTruthy();
  });
});
