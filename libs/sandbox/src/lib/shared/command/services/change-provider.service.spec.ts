import { ChangeType } from '@dontcode/core';
import { TestBed } from '@angular/core/testing';

import { ChangeProviderService } from './change-provider.service';
import { Change } from '@dontcode/core';
import { Subscription } from 'rxjs';

describe('CommandProviderService', () => {
  let service: ChangeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate next item', () => {
    const testPosition="creation/screens/a/components/b";
    expect(service.nextItemEndPosition(testPosition, 0)).toEqual({pos:7, value:"creation"});
    let result=service.nextItemEndPosition(testPosition, "creation".length);
    expect(result).toEqual({pos:15, value:"screens"});
    result = service.nextItemEndPosition(testPosition, result.pos+1);
    expect(result).toEqual({pos:17, value:"a"});
    result = service.nextItemEndPosition(testPosition, result.pos+1);
    expect(result).toEqual({pos:28, value:"components"});

    expect(service.nextItemEndPosition(testPosition, "creation/screens/a/".length)).toEqual({pos:28, value:"components"});
    expect(service.nextItemEndPosition(testPosition, "creation/screens/a/components".length)).toEqual({pos:30, value:"b"});
    expect(service.nextItemEndPosition(testPosition, "creation/screens/a/components/".length)).toEqual({pos:30, value:"b"});
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
      subscriptions.add(service.receiveCommands('creation/screens').subscribe(
        notified
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b', '{\"name\"=\"NewName\"}'));
      expect(notified).toHaveBeenCalledTimes(2);
      service.pushChange (new Change (ChangeType.UPDATE, 'creation/screens/b/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(3);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b/components/b', '{\"type\"=\"edit\"}'));
      expect(notified).toHaveBeenCalledTimes(4);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens/?').subscribe(
        notified
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(4);
      service.pushChange (new Change (ChangeType.DELETE, 'creation/screens/b', null));
      expect(notified).toHaveBeenCalledTimes(5);
      subscriptions.unsubscribe();

      subscriptions = new Subscription();
      subscriptions.add(service.receiveCommands('creation/screens/?', 'name').subscribe(
        notified
      ));
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/a/name', 'NewName'));
      expect(notified).toHaveBeenCalledTimes(6);
      service.pushChange (new Change (ChangeType.DELETE, 'creation/screens/b', null));
      expect(notified).toHaveBeenCalledTimes(6);
      service.pushChange (new Change (ChangeType.ADD, 'creation/screens/b/components/c/type', 'view'));
      expect(notified).toHaveBeenCalledTimes(6);
    } finally {
      subscriptions.unsubscribe();
      service.close();
    }
  });

  it('support reset properly', () => {
    const subscriptions = new Subscription();
    const notified = jest.fn();
    const notifiedQuestionMark = jest.fn();
    try {
      subscriptions.add(service.receiveCommands('creation', 'name').subscribe(
        notified
      ));
      subscriptions.add(service.receiveCommands('creation/entities', 'name').subscribe(
        notified
      ));
      subscriptions.add(service.receiveCommands('creation/entities/?').subscribe(value => {
          notifiedQuestionMark();
      }
      ));

      service.pushChange (new Change (ChangeType.RESET, '/', {
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
      expect(notified).toHaveBeenCalledTimes(3);
      expect(notifiedQuestionMark).toHaveBeenCalledTimes(3);
    } finally {
      subscriptions.unsubscribe();
      service.close();
    }
  });

});
