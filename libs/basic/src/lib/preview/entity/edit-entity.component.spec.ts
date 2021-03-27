import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityComponent } from './edit-entity.component';
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('EditEntityComponent', () => {
  let component: EditEntityComponent;
  let fixture: ComponentFixture<EditEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEntityComponent ],
      imports: [CheckboxModule, FormsModule, InputNumberModule, InputTextModule, ReactiveFormsModule, PluginCommonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
