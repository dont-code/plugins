import { TestBed, waitForAsync } from '@angular/core/testing';
import { ScreenModule } from './screen.module';

describe('ScreenModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScreenModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScreenModule).toBeDefined();
  });
});
