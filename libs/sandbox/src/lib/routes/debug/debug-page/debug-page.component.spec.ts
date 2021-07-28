import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DebugPageComponent } from './debug-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('DebugPageComponent', () => {
  let component: DebugPageComponent;
  let fixture: ComponentFixture<DebugPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
