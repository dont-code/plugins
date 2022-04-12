import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TimeFieldsComponent } from './time-fields.component';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

describe('TimeFieldsComponent', () => {
  let component: TimeFieldsComponent;
  let fixture: ComponentFixture<TimeFieldsComponent>;

  let wrapperComponent: WrapperComponent;
  let wrapperFixture: ComponentFixture<WrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeFieldsComponent, WrapperComponent],
      imports: [
        BrowserModule,
        CalendarModule,
        TooltipModule,
        ReactiveFormsModule,
        FormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    wrapperFixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = wrapperFixture.componentInstance;
    wrapperFixture.detectChanges(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should support setting date ', () => {
    wrapperComponent.form?.setValue({
      TestDate: new Date('2022-03-31T01:20:35.633Z'),
    });
  });
});

@Component({
  template: `
    <plugins-time-fields></plugins-time-fields>
    <form [formGroup]="form">
      <ng-container
        *ngTemplateOutlet="template(); context: { fieldName: 'TestDate' }"
      ></ng-container>
    </form>
  `,
})
class WrapperComponent implements OnInit {
  @ViewChild(TimeFieldsComponent, { static: true })
  appComponentRef: TimeFieldsComponent | undefined;

  form: FormGroup;

  constructor() {
    const fb = TestBed.inject(FormBuilder);

    this.form = fb.group(
      {
        TestDate: [new Date('2022-03-31T01:20:26.036Z')],
      },
      { updateOn: 'blur' }
    );
  }
  template(): TemplateRef<any> | null | undefined {
    const ret =
      this.appComponentRef?.providesTemplates('Date & Time').forFullEdit;
    return ret;
  }

  ngOnInit(): void {
    this.appComponentRef?.setName('TestDate');
    this.appComponentRef?.setForm(this.form);
  }
}
