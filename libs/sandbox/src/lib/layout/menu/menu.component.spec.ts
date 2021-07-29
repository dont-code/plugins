import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";

import {MenuComponent} from "./menu.component";
import {RouterTestingModule} from "@angular/router/testing";
import {SANDBOX_CONFIG} from "../../shared/config/sandbox-lib-config";
import {MenuModule} from "primeng/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [BrowserAnimationsModule, RouterTestingModule, MenuModule],
      providers: [{
          provide:SANDBOX_CONFIG, useValue:{
          webSocketUrl:''
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
