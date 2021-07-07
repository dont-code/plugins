import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EuroDollarComponent} from './euro-dollar.component';
import {InputNumberModule} from 'primeng/inputnumber';

describe('EuroDollarComponent', () => {
  let component: EuroDollarComponent;
  let fixture: ComponentFixture<EuroDollarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuroDollarComponent],
      imports: [ InputNumberModule, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EuroDollarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
