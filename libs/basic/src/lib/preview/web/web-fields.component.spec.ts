import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WebFieldsComponent} from "./web-fields.component";
import {TooltipModule} from "primeng/tooltip";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('WebFieldsComponent', () => {
  let component: WebFieldsComponent;
  let fixture: ComponentFixture<WebFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebFieldsComponent ],
      imports: [InputTextModule, TooltipModule, ReactiveFormsModule, FormsModule, ConfirmDialogModule, PluginCommonModule.forRoot()],
      providers: [ConfirmationService]
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
