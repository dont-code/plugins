import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFieldsComponent } from './basic-fields.component';
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('BasicFieldsComponent', () => {
  let component: BasicFieldsComponent;
  let fixture: ComponentFixture<BasicFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFieldsComponent ],
      imports: [InputTextModule, InputNumberModule, CheckboxModule, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
