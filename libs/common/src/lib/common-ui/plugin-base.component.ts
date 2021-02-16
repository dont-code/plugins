import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Change, ChangeType, CommandProviderInterface, DontCodeModelPointer } from "@dontcode/core";
import { map } from "rxjs/operators";

@Component({template:''})
export abstract class PluginBaseComponent implements OnInit, OnDestroy {
  protected subscriptions = new Subscription();
  entityPointer:DontCodeModelPointer;
  provider: CommandProviderInterface;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe();
  }

  protected forceUnsubscribe(): void {
    this.subscriptions.unsubscribe();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    this.entityPointer = pointer;
    this.provider = provider;
  }

  /**
   * When the component is created for display, it receives the initial data as complete Json.
   * If it wants, it can call this method who will call handleChange for each property.
   * This will avoid to duplicate code (first time when a complete json is sent, second when subelements are sent)
   * @protected
   */
  protected decomposeJsonToMultipleChanges(pointer:DontCodeModelPointer, json:any): void {
    if (json) {
      let change:Change;
      for (let prop in json) {
        const subPropertyPointer = pointer.subPropertyPointer (prop);
        const propType = this.provider.getSchemaManager().locateItem(subPropertyPointer.schemaPosition);
        if( propType?.isArray()) {
          this.decomposeJsonToMultipleChanges(subPropertyPointer, json[prop]);
        } else {
          change = new Change(
            ChangeType.ADD,
            pointer.position + '/' + prop,
            json[prop],
            subPropertyPointer);
          if(!propType) {
              // This is not a sub property but a subItem of an array
            change.pointer.itemId=change.pointer.key;
            change.pointer.key = null;
          }

          this.handleChange(change);
        }
      }
    }
  }

  /**
   * Calls handleChange each time a change event for any element below this (as per the model's position) is received
   * @protected
   */
  protected initChangeListening () {
    this.subscriptions.add (this.provider.receiveCommands(this.entityPointer.position).pipe(
      map (change => {
        this.handleChange(change);
      }))
      .subscribe()
    );

  }

  /**
   * This is where components react to changes received
   * @param change
   * @protected
   */
  protected abstract handleChange (change: Change );

  /**
   * Retrieve the value of the key property if the change concerns it
   * @param change
   * @param key
   */
  decodeStringField(change: Change, key: string): string {
    if (change.pointer.key === key) {
      return change.value;
    } else
      return undefined;
  }

  /**
   * Updates a map of items (stored as a json object)
   * @param change
   * @param currentMap: The current list of objects to modify
   * @param key
   */
/*  decodeMapField(change: Change, currentMap:any, key: string): any {
    if (change.pointer.calculateKeyOrContainer() === key) {
      let id=change.pointer.itemId;

      let ret= { };
      let found=false;

      if( currentMap) {
        Object.keys(currentMap).forEach(curKey => {
              // If no keys are given, use the change position to detect updates vs add
          if (curKey === id) {
            ret[curKey]=change.value;
            found = true;
          } else {
            ret[curKey]=currentMap[curKey];
          }
        });
      }

      if(!found)
        ret[id]=change.value;

      return ret;
    } else
      return undefined;
  }
*/
  /**
   * Updates the array of T elements by applying the changes received and calling the transform method
   * @param cols
   * @param colsMap
   * @param change
   * @param property
   * @param transform
   * @private
   */
  applyUpdatesToArray<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string, transform: (key:string, item:any) => T, applyProperty?: (target:T, key:string, value:any) => boolean): T[] {
    const itemId = change.pointer.calculateItemIdOrContainer();
    let newTarget:T = null;
    let pos = -1;
    let targetPos = -1;

    if (targetMap.has(itemId)) {  // Does the target item already exist ?
      pos = targetMap.get(itemId);
      newTarget = target[pos];
    }
    if (change.beforeKey) {
      targetPos = targetMap.get(change.beforeKey);
    }
    switch (change.type) {
      case ChangeType.ADD:
      case ChangeType.UPDATE:
        if (change.pointer.itemId==null)  // It's not a replacement of the item but a change in one of its property
        {
          // Can we try to update directly the sub property?
          if ((!newTarget) || (
            (newTarget) &&
            ((!applyProperty)
              || (!applyProperty(newTarget, change.pointer.key, change.value))
            ))
          ) {
            // It cannot be dynamically updated by the caller, so we do a full replacement
            const fullValue = this.provider.getJsonAt(change.pointer.containerPosition);
            newTarget = transform(property, fullValue);
          }
        }else {
          // The new value replace the old one
          newTarget = transform(property, change.value);
        }
        break;
      case ChangeType.MOVE:
        if( pos !== -1) {
          // We delete the element moved, it will be inserted at the right position later
          if ((targetPos!==-1) && (targetPos > pos))
            targetPos--;
          target.splice(pos, 1);
          // Recalculate all indexes in targetMap
          targetMap.forEach((value, key) => {
            if( value>pos) {
              targetMap.set(key, value-1);
            }
          });
          targetMap.delete(itemId);
          pos=-1;
          }
        break;
      case ChangeType.DELETE:
        target.splice(pos, 1);
        // Recalculate all indexes in targetMap
        targetMap.forEach((value, key) => {
          if( value>pos) {
            targetMap.set(key, value-1);
          }
        });
        targetMap.delete(itemId);
        newTarget=null;
        break;
    }

    if (newTarget) {
      if( pos!==-1) {
          // We just need to replace the new value at the same position
        target[pos]=newTarget;
      } else if (targetPos!==-1) {
          // Insert the element at the correct position
          target.splice(targetPos, 0, newTarget);
          // Recalculate all indexes in targetMap
          targetMap.forEach((value, key) => {
            if( value>=targetPos) {
              targetMap.set(key, value+1);
            }
          });
          targetMap.set(itemId, targetPos);
        } else {
        // Insert the element at the end
        target.push(newTarget);
        targetMap.set(itemId,targetMap.size);
      }
    }
/*    if (change.pointer.itemId==null)  // It's not a replacement of the item but a change in one of its property
      {
          // Can we try to update directly the sub property?
        if ((!newTarget) || (
          (newTarget) &&
          ((!applyProperty)
            || (!applyProperty(newTarget, change.pointer.key, change.value))
          ))
        ) {
          // It cannot be dynamically updated by the caller, so we do a full replacement
          let fullValue = this.provider.getJsonAt(change.pointer.containerPosition);
          newTarget = transform(property, fullValue);
        }
      } else if (change.type!==ChangeType.MOVE) {
        // The new value replace the old one
        newTarget = transform(property, change.value);
      }
      // Set or Add newTarget
      if (pos==-1) { // The target element didn't exist before so we insert it
        // Insert the new element
        let pos = target.push(newTarget) - 1;
        targetMap.set(itemId, pos);
      } else if( change.type!==ChangeType.MOVE) {
        // Replace the modified element
        target[pos] = newTarget;
      } else {
        // It's an element moved to a new position
        let targetPos = targetMap.get(change.beforeKey);
        if (targetPos > pos) targetPos--;
        if (targetPos != pos) { // Move only if needed
          target.splice(pos, 1);
          target.splice(targetPos,0,newTarget);
          // Recalculate all indexes in targetMap
          targetMap.forEach((value, key) => {
            let newValue=value;
            if( value===pos) {
              newValue = targetPos;
            } else {
            if( value>pos) newValue--;
            if( value>=targetPos) newValue++;
            }
            targetMap.set(key, newValue);
          });
      }

      }*/
    return target;
  }


}
