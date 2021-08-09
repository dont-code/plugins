import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponent } from './rating.component';
import {DropdownModule} from 'primeng/dropdown';
import {ReactiveFormsModule} from '@angular/forms';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingComponent ],
      imports: [DropdownModule, ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
