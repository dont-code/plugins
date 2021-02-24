import {TestBed, waitForAsync} from '@angular/core/testing';
import {BasicModule} from './basic.module';

describe('BasicModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BasicModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BasicModule).toBeDefined();
  });
});
