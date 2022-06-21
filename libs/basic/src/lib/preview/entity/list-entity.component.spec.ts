import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntityComponent } from './list-entity.component';
import {TableModule} from "primeng/table";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('ListEntityComponent', () => {
  let component: ListEntityComponent;
  let fixture: ComponentFixture<ListEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEntityComponent ],
      imports: [TableModule, PluginCommonModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
