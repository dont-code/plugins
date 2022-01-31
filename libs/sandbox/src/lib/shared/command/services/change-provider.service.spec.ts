import {Change, ChangeType, DontCodeModelPointer} from '@dontcode/core';
import {TestBed} from '@angular/core/testing';

import {ChangeProviderService} from './change-provider.service';
import {Subscription} from 'rxjs';
import {HttpClientTestingModule} from "@angular/common/http/testing";


describe('CommandProviderService', () => {
  let service: ChangeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
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
      expect(notified).toHaveBeenCalledTimes(4);
      service.pushChange (new Change (ChangeType.UPDATE, 'creation/screens/b/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(5);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b/components/b', {type:"edit"}));
      expect(notified).toHaveBeenCalledTimes(9);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens/?').subscribe( change => {
          notified();
        }
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(9);
      service.pushChange (new Change (ChangeType.DELETE, 'creation/screens/b', null));
      expect(notified).toHaveBeenCalledTimes(11);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens/?', 'name').subscribe(
        notified
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(12);
      service.pushChange (new Change (ChangeType.DELETE, 'creation/screens/b', null));
      expect(notified).toHaveBeenCalledTimes(12);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b/components/c/type', 'view'));
      expect(notified).toHaveBeenCalledTimes(12);
    } finally {
      subscriptions.unsubscribe();
      service.close();
    }
  });

  it('support reset properly', () => {
    const subscriptions = new Subscription();
    const notified = waitableJestFn(3);
    const notifiedQuestionMark = waitableJestFn(3);
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
