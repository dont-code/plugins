import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import {
  Change,
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodeSchemaManager,
  dtcde,
} from '@dontcode/core';
import { ValueService } from '../../values/services/value.service';
import { ChangeListenerService } from '../../change/services/change-listener.service';

@Injectable({
  providedIn: 'root',
})
export class ChangeProviderService implements CommandProviderInterface {
  protected subscriptions = new Subscription();
  protected receivedChanges = new Subject<Change>();
  protected changesHistory = new ReplaySubject<Change>();

  protected listeners = new Map<
    { position: string; property?: string },
    Subject<Change>
  >();
  protected listenerCachePerPosition = new Map<
    string,
    Array<Subject<Change>>
  >();

  constructor(
    protected changeListener: ChangeListenerService,
    protected valueService: ValueService
  ) {
    this.subscriptions.add(
      changeListener.getChangeEvents().subscribe((change) => {
        // console.log ('Received Change ', change);
        this.pushChange(change);
      })
    );
  }

  /**
   * Check if the change affects the given position
   * @param pos
   * @param change
   * @protected
   */
  protected isInterestedIn(
    position: string,
    property: string | undefined,
    change: Change
  ): boolean {
    let onlyLevel = false;
    if (position[position.length - 1] === '?') {
      onlyLevel = true;
      position = position.substring(0, position.length - 1);
    }
    if (position[position.length - 1] === '/') {
      position = position.substring(0, position.length - 1);
    }
    //console.log("Setting Commands updates for ", position);
    //console.log("Filtering position for pos,item:", command.position, position, lastItem);
    if (change.position != null && change.position.startsWith(position)) {
      let nextPosition = DontCodeModelPointer.nextItemAndPosition(
        change.position,
        position.length + 1
      );
      const nextItem = nextPosition.value;
      if (property) {
        if (nextItem === property) {
          //console.log("Filtering ok");
          return true;
        } else {
          nextPosition = DontCodeModelPointer.nextItemAndPosition(
            change.position,
            nextPosition.pos + 1
          );
          if (nextPosition.value === property) {
            return true;
          }
        }
        //console.log("Filtering no");
        return false;
      } else if (onlyLevel) {
        //console.log("Filtering ok");
        if (nextItem != null) {
          // Check if its the last item
          nextPosition = DontCodeModelPointer.nextItemAndPosition(
            change.position,
            nextPosition.pos + 1
          );
          if (nextPosition.value === '') return true;
        }
        return false;
      } else {
        return true;
      }
    } else {
      //console.log("Filtering no");
      return false;
    }
  }

  protected createNewListener(
    position: string,
    property?: string
  ): Observable<Change> {
    const key = { position, property };
    let item = this.listeners.get(key);
    if (!item) {
      item = new Subject<Change>();
      this.listeners.set(key, item);
      this.listenerCachePerPosition.clear();
    }
    return item;
  }

  protected addToListenerCache(position: string, who: Subject<Change>) {
    let interesteds = this.listenerCachePerPosition.get(position);
    if (!interesteds) {
      interesteds = new Array<Subject<Change>>();
      this.listenerCachePerPosition.set(position, interesteds);
    }

    interesteds.push(who);
  }

  getJsonAt(position: string): any {
    return this.valueService.findAtPosition(position, false);
  }

  pushChange(change: Change) {
    const subChanges = this.valueService.applyChange(change);
    this.manageChangeInternally(change);
    // Sends as well the subChanges induced by this change
    subChanges.forEach((subChange) => {
      if (
        subChange.type !== change.type ||
        subChange.position !== change.position
      ) {
        this.manageChangeInternally(subChange);
      }
    });
  }

  manageChangeInternally(change: Change) {
    if (!change.pointer) {
      change.pointer = this.calculatePointerFor(change.position);
    }

    this.receivedChanges.next(change);

    this.findAndNotify(change, new Map<Subject<Change>, Array<string>>());

    this.changesHistory.next(change);
  }

  /**
   * Finds a listener that is interested in this change and notifies it.
   * @param change
   * @param alreadyCalled
   */
  findAndNotify(
    change: Change,
    alreadyCalled: Map<Subject<Change>, Array<string>>
  ) {
    // First resolve the position and cache it
    if (!this.listenerCachePerPosition.get(change.position)) {
      this.listeners.forEach((value, key) => {
        if (this.isInterestedIn(key.position, key.property, change)) {
          this.addToListenerCache(change.position, value);
        }
      });
    }

    const affected = this.listenerCachePerPosition.get(change.position);
    affected?.forEach((subject) => {
      let canCall = true;
      const positions = alreadyCalled.get(subject);
      if (positions) {
        // Don't call twice the same listener for the same or parent position
        for (const position of positions) {
          if (change.position.startsWith(position)) {
            canCall = false;
          }
        }
      } else {
        alreadyCalled.set(subject, new Array<string>());
      }
      if (canCall) {
        subject.next(change);
        alreadyCalled.get(subject)?.push(change.position);
      }
    });
  }

  /*  morphChangeToChild (change:Change, child:string ): Change {
    if( !change.pointer) throw new Error('Missing pointer in change to morph');
    const newPointer = this.getSchemaManager().generateSubSchemaPointer(change.pointer, child);
    const newChange=new Change(change.type, newPointer.position, change.value[child], newPointer );

    return newChange;
  }*/

  getChangesHistory(): Observable<Change> {
    return this.changesHistory;
  }

  /**
   * Be notified when something changes in the model at the following position
   * for example:
   * position: /creation/screens, property: name will be notified of all name changes for all screens
   * position: /creation/screens, property: null will be notified of any change in any screen and subscreens
   * position: /creation/screens/a, property: null will be notified on changes in screen a and below
   * position: /creation/screens/?, property: null will be notified on changes in screen items (move, delete), and not below
   * position: null, property: null will be notified on all changes
   * @param position
   * @param property
   */
  receiveCommands(position?: string, property?: string): Observable<Change> {
    if (position) {
      return this.createNewListener(position, property);
    } else return this.receivedChanges;
  }

  getSchemaManager(): DontCodeSchemaManager {
    return dtcde.getSchemaManager();
  }

  calculatePointerFor(position: string): DontCodeModelPointer {
    const ret = dtcde.getSchemaManager().generateSchemaPointer(position);
    return ret;
  }

  close() {
    this.receivedChanges.complete();
    this.subscriptions.unsubscribe();
  }

  /**
   * Removes ? or / from end of position
   * @param position
   * @private
   */
  private cleanPosition(position: string): string {
    position = position.endsWith('?')
      ? position.substring(0, position.length - 1)
      : position;
    position = position.endsWith('/')
      ? position.substring(0, position.length - 1)
      : position;
    return position;
  }
}
