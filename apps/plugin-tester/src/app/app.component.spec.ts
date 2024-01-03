import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DONT_CODE_COMMON_CONFIG, PluginCommonModule} from "@dontcode/plugin-common";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, PluginCommonModule.forRoot()],
      declarations: [AppComponent],
      providers: [{provide: DONT_CODE_COMMON_CONFIG, useValue: {}}]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
