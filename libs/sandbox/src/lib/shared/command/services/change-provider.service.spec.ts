import {Change, ChangeType, DontCodeModel} from '@dontcode/core';
import {TestBed} from '@angular/core/testing';

import {ChangeProviderService} from './change-provider.service';
import {Subscription} from 'rxjs';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PluginCommonModule} from "@dontcode/plugin-common";


describe('CommandProviderService', () => {
  let service: ChangeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, PluginCommonModule.forRoot()]
    });
    service = TestBed.inject(ChangeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should updates content from changes', () => {
    service.pushChange (new Change (ChangeType.UPDATE, 'creation/name', 'NewName'));
    expect (service.getJsonAt('creation')).toHaveProperty ('name', "NewName");
  });

  it('should filter properly', () => {
    let subscriptions = new Subscription();
    const notified = jest.fn();
    try {
      subscriptions.add(service.receiveCommands('creation/screens', 'name').subscribe(
        notified
      ));
      service.pushChange (new Change (ChangeType.UPDATE, 'creation/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(0);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(1);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens').subscribe(change => {
          notified();
      }

      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b', {name:"NewName"}));
      expect(notified).toHaveBeenCalledTimes(5);
      service.pushChange (new Change (ChangeType.UPDATE, 'creation/screens/b/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(6);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b/components/b', {type:"edit"}));
      expect(notified).toHaveBeenCalledTimes(10);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens/?').subscribe( change => {
          notified();
        }
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(11);
      service.pushChange (new Change (ChangeType.DELETE, 'creation/screens/b', null));
      expect(notified).toHaveBeenCalledTimes(13);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens/?', 'name').subscribe(
        notified
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(15);
      service.pushChange (new Change (ChangeType.DELETE, 'creation/screens/b', null));
      expect(notified).toHaveBeenCalledTimes(15);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b/components/c/type', 'view'));
      expect(notified).toHaveBeenCalledTimes(15);
    } finally {
      subscriptions.unsubscribe();
      service.close();
    }
  });

  it('support reset properly', () => {
    const subscriptions = new Subscription();
    const notified = waitableJestFn(3);
    const notifiedQuestionMark = waitableJestFn(3);
    service.pushChange (new Change (ChangeType.RESET, '', {}));
    try {
      subscriptions.add(service.receiveCommands('creation', 'name').subscribe( value => {
        notified();
        }
      ));
      subscriptions.add(service.receiveCommands('creation/entities', 'name').subscribe( value => {
        notified();
        }
      ));
      subscriptions.add(service.receiveCommands('creation/entities/?').subscribe(value => {
          notifiedQuestionMark();
      }
      ));

      service.pushChange (new Change (ChangeType.RESET, '', {
        creation: {
          name:'CreationName',
          entities: {
            'a': {
              name:'entityA'
            },
            'b': {
              name:'entityB'
            }
          }
        }
      }));
      notified.waitUntilComplete();
      expect(notified).toHaveBeenCalledTimes(3);
      notifiedQuestionMark.waitUntilComplete();
      expect(notifiedQuestionMark).toHaveBeenCalledTimes(3);
    } finally {
      subscriptions.unsubscribe();
      service.close();
    }
  });

  it('should notify new listeners', (done) => {
    const subscriptions = new Subscription();
    const notified = waitableJestFn(1);
    service.pushChange(new Change(ChangeType.RESET, "creation/entities/a", {name:'TestName'}));

    try {
      subscriptions.add(service.receiveCommands(DontCodeModel.APP_ENTITIES, DontCodeModel.APP_ENTITIES_NAME_NODE).subscribe(
        notified
      ));
      subscriptions.add(service.receiveCommands('creation/entities/?', DontCodeModel.APP_ENTITIES_NAME_NODE).subscribe(
        notified
      ));
      subscriptions.add(service.receiveCommands('creation/entities/?', undefined).subscribe(
        notified
      ));
      notified.waitUntilComplete();
      expect(notified).toHaveBeenCalledTimes(3);
      done();
    } finally {
      subscriptions.unsubscribe();
      service.close();
    }
  });

});

// Standard code to wait for a number of calls before testing the result
type WaitableMock = jest.Mock & {
  waitUntilComplete(): Promise<void>
}

export const waitableJestFn = (times: number): WaitableMock => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let _resolve: Function
  const promise = new Promise<void>(resolve => _resolve = resolve)

  let i = 0
  const mock = jest.fn(() => {
    // debug('mock is called', i, times)
    if (++i >= times)
      _resolve()
  }) as WaitableMock // force casting

  mock.waitUntilComplete = () => promise

  return mock
}
