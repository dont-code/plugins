import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MoneyComponent} from './money.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('MoneyComponent', () => {
  let component: MoneyComponent;
  let fixture: ComponentFixture<MoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyComponent ],
      imports: [DropdownModule, InputNumberModule, FormsModule, ReactiveFormsModule, PluginCommonModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
