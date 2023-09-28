import {Injectable} from '@angular/core';
import {mergeAll, Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {
  Action,
  Change,
  CommandProviderInterface,
  DontCodeChangeManager,
  DontCodeModelPointer,
  DontCodeSchemaManager,
} from '@dontcode/core';
import {ValueService} from '@dontcode/plugin-common';
import {ChangeListenerService} from '../../change/services/change-listener.service';

@Injectable({
  providedIn: 'root',
})
export class ChangeProviderService implements CommandProviderInterface {
  protected subscriptions = new Subscription();
  protected changesHistory = new ReplaySubject<Change>();

  constructor(
    protected changeListener: ChangeListenerService,
    protected valueService: ValueService,
    protected schemaManager: DontCodeSchemaManager,
    protected changeManager: DontCodeChangeManager
  ) {
    this.subscriptions.add(
      changeListener.getChangeEvents().subscribe((change) => {
        // console.log ('Received Change ', change);
        this.pushChange(change);
      })
    );
  }

  getJsonAt(position: string): any {
    return this.changeManager.getJsonAt(position);
  }

  pushChange(change: Change) {
    this.changeManager.pushChange(change);
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
    this.changeManager.findAndNotify(change, alreadyCalled);
  }

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
    return this.changeManager.receiveCommands(position, property);
  }

  getSchemaManager(): DontCodeSchemaManager {
    return this.schemaManager;
  }

  calculatePointerFor(position: string): DontCodeModelPointer {
    const ret = this.schemaManager.generateSchemaPointer(position);
    return ret;
  }

  close() {
//    this.changeManager.close();
    this.subscriptions.unsubscribe();
  }

  /**
   * Send a command to whatever component listens to, and return a Promise when ALL components have made the action
   * @param action
   */
  sendCommand(action: Action): Promise<void> {
    let subscription:Subscription|null=null;

    return new Promise<void> ((resolve, reject) => {
      if( action.running!=null) {
        subscription = action.running.pipe(
          mergeAll(1)
        ).subscribe({
          complete: () => resolve (), // Resolve the promise only when the observer completed all promises
          error: (reason) => reject(reason)
        });
        // Normally we are unsubscribing after the promise is done, but let's make sure we unsubscribe
        this.subscriptions.add(subscription);
        this.pushChange(action);
          // Complete the action right after all other changes have passed through
        action.running.next(new Promise<void>((resolve) => {
          action.running?.complete();
          resolve();
        }));
      } else reject("No running observer in action");
    }).then( () => {
      subscription?.unsubscribe();
    }).catch( () => {
      subscription?.unsubscribe();
    });
  }

}
