import { async, ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BasicEntityComponent } from './basic-entity.component';
import { TableModule } from "primeng/table";

describe('BasicEntityComponent', () => {
  let component: BasicEntityComponent;
  let fixture: ComponentFixture<BasicEntityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicEntityComponent ],
      imports: [TableModule]
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
