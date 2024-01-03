import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";

import {MainComponent} from "./main.component";
import {RouterTestingModule} from "@angular/router/testing";
import {MenuComponent} from "../menu/menu.component";
import {DONT_CODE_COMMON_CONFIG} from "@dontcode/plugin-common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToolbarModule} from "primeng/toolbar";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {SidebarModule} from "primeng/sidebar";
import {MenuModule} from "primeng/menu";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent, MenuComponent],
      imports: [
        BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule,
        ToolbarModule, OverlayPanelModule, SidebarModule, MenuModule, PluginCommonModule.forRoot()
      ],
      providers: [{
        provide:DONT_CODE_COMMON_CONFIG, useValue:{
          webSocketUrl:''
        }
      }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
