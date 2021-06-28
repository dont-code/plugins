import { ComponentFixture, TestBed } from '@angular/core/testing';

import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TimeFieldsComponent} from "./time-fields.component";

describe('TimeFieldsComponent', () => {
  let component: TimeFieldsComponent;
  let fixture: ComponentFixture<TimeFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeFieldsComponent ],
      imports: [InputTextModule, InputNumberModule, CheckboxModule, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
