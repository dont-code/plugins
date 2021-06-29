import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WebFieldsComponent} from "./web-fields.component";
import {TooltipModule} from "primeng/tooltip";

describe('WebFieldsComponent', () => {
  let component: WebFieldsComponent;
  let fixture: ComponentFixture<WebFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebFieldsComponent ],
      imports: [InputTextModule, TooltipModule, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
