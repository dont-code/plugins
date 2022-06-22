import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefaultViewerComponent } from './default-viewer.component';
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('DefaultViewerComponent', () => {
  let component: DefaultViewerComponent;
  let fixture: ComponentFixture<DefaultViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultViewerComponent ],
      imports: [ReactiveFormsModule, InputTextModule, PluginCommonModule.forRoot()]
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
