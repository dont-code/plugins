import { async, TestBed } from '@angular/core/testing';
import { BasicModule } from './basic.module';

describe('BasicModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BasicModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BasicModule).toBeDefined();
  });
});
