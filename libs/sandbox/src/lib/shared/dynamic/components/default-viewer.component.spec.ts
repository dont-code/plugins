import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefaultViewerComponent } from './default-viewer.component';

describe('DefaultViewerComponent', () => {
  let component: DefaultViewerComponent;
  let fixture: ComponentFixture<DefaultViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
