import {
  Action,
  ActionContextType,
  ActionType,
  Change,
  ChangeType,
  DontCodeChangeManager,
  DontCodeSchemaManager, dtcde
} from '@dontcode/core';
import {TestBed} from '@angular/core/testing';

import {ChangeProviderService} from './change-provider.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PluginCommonModule, ValueService} from "@dontcode/plugin-common";
import {ChangeListenerService} from "@dontcode/sandbox";


describe('CommandProviderService', () => {
  let service: ChangeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PluginCommonModule.forRoot()]
    });
    service = TestBed.inject(ChangeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should updates content from changes', () => {
    service.pushChange(new Change(ChangeType.UPDATE, 'creation/name', 'NewName'));
    expect(service.getJsonAt('creation')).toHaveProperty('name', "NewName");
  });

  it('should make sure Actions are processed sequentially', (done) => {
    const testService = new TestChangeProviderService ();
    testService.sendCommand(new Action('creation/entity', {}, ActionContextType.LIST, ActionType.EXTRACT)).then (() => {
      expect(TestChangeProviderService.count).toEqual (10);
      done();
    }).catch(reason => {
      done (reason);
    });
  });

});

/**
 *
 * Override pushChange with some special code to test sendCommand behavior
 * */
class TestChangeProviderService extends ChangeProviderService {

  public  static count=0;

  constructor() {
    super(TestBed.inject(ChangeListenerService), TestBed.inject(ValueService), dtcde.getSchemaManager(), dtcde.getChangeManager());
  }

  override pushChange(change: Change) {
    const action =change as Action;
    // Just add some dummy promise to ensure it waits for all
    for (let i=0;i<10;i++) {
      action.running?.next(new Promise<void>(resolve => {
        setTimeout(() => {
          TestChangeProviderService.count++;
          resolve();
        },Math.random()*1000);
      }))
    }
  }
}
