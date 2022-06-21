import {Change, dtcde} from "@dontcode/core";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {DontCodeModelManager} from "@dontcode/core";

/**
 * Stores and constantly updates the json (as an instance of the DontCodeSchema) as it is being edited / modified through Change events
 * It does not store the entity values but the description of entities, screens... as defined in the Editor
 */
@Injectable({
  providedIn: 'root'
})
export class ValueService {

  constructor(protected modelMgr:DontCodeModelManager) {
  }

  getContent(): any {
    return this.modelMgr.getContent();
  }

  /**
   * Resets the current json content to the one given in parameter
   * @param newContent
   */
  resetContent(newContent: any): void {
    this.modelMgr.resetContent(newContent);
  }
  /**
   * Subscribes to the Subject in parameter to receive model updates through changes.
   * Changes are generated by the Editor as the user modifies the application.
   * It then modifies it's internal json to be up to date.
   * @param receivedCommands
   * @deprecated in favor of applyChange
   */
/*  receiveUpdatesFrom(receivedCommands: Subject<Change>): void {
    this.model.receiveUpdatesFrom(receivedCommands);
  }
*/
  /**
   * Apply the change to the model and returns the list of subchanges implied by it
   * @param chg
   */
  applyChange (chg: Change): Change[] {
    return this.modelMgr.applyChange(chg);
  }
  /**
   * Provides the json extract at the given position.
   * For example, findAtPosition ('creation/entities/a') will returns the description (fields...) of the first entity created with the editor
   * @param position
   * @param create
   */
  findAtPosition(position: string, create?: boolean): any {
    return this.modelMgr.findAtPosition(position, create);
  }

}
