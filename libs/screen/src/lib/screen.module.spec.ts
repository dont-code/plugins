import { async, TestBed } from '@angular/core/testing';
import { ScreenModule } from './screen.module';

describe('ScreenModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScreenModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScreenModule).toBeDefined();
  });
});
