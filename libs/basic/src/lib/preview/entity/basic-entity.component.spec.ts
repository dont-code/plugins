import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";

import {BasicEntityComponent} from './basic-entity.component';
import {TabViewModule} from "primeng/tabview";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {EditEntityComponent} from "./edit-entity.component";
import {ListEntityComponent} from "./list-entity.component";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";

describe('BasicEntityComponent', () => {
  let component: BasicEntityComponent;
  let fixture: ComponentFixture<BasicEntityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicEntityComponent],
      imports: [TableModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
