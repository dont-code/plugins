import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";

import {MenuComponent} from "./menu.component";
import {RouterTestingModule} from "@angular/router/testing";
import {DONT_CODE_COMMON_CONFIG} from "@dontcode/plugin-common";
import {MenuModule} from "primeng/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, MenuModule, PluginCommonModule.forRoot()],
      providers: [{
          provide:DONT_CODE_COMMON_CONFIG, useValue:{
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
