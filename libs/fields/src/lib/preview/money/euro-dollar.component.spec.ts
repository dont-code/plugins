import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {EuroDollarComponent} from './euro-dollar.component';

describe('EuroDollarComponent', () => {
  let component: EuroDollarComponent;
  let fixture: ComponentFixture<EuroDollarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuroDollarComponent],
      imports: [ ReactiveFormsModule]
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
