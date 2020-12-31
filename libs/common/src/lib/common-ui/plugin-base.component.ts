import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Change, CommandProviderInterface, DontCodeModelPointer } from "@dontcode/core";

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
  decodeMapField(change: Change, currentMap:any, key: string): any {
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
    let itemId = change.pointer.calculateItemIdOrContainer();
    let newTarget:T = null;
    let pos = -1;

    if (targetMap.has(itemId)) {  // Does the target item already exist ?
      pos = targetMap.get(itemId);
      newTarget = target[pos];
    } else {  // No, it does not exist
    }
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
          let fullValue = this.provider.getJsonAt(change.pointer.containerPosition);
          newTarget = transform(property, fullValue);
        }
      } else {
        // The new value replace the old one
        newTarget = transform(property, change.value);
      }
      // Set or Add newTarget
      if (pos!=-1) { // It's not a replacement of the item but a change in one of its property
        target[pos] = newTarget;
      } else {
        let pos = target.push(newTarget) - 1;
        targetMap.set(itemId, pos);
      }
    return target;
  }


}
