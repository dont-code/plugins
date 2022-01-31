import {Change, ChangeType, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {map} from "rxjs/operators";
import {from, Observable, of, Subscription} from "rxjs";

export class PluginHandlerHelper {
  protected subscriptions = new Subscription();

  entityPointer: DontCodeModelPointer | null = null
  provider: CommandProviderInterface | null = null;
  changeHandler!: PreviewHandler;

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer, changeHandler: PreviewHandler): any {
    this.entityPointer = pointer;
    this.provider = provider;
    this.changeHandler = changeHandler;
  }

  /**
   * When the component is created for display, it receives the initial data as complete Json.
   * If it wants, it can call this method who will call handleChange for each property.
   * This will avoid to duplicate code (first when a complete json is sent, then when subelements are sent)
   * @protected
   */
  decomposeJsonToMultipleChanges(pointer: DontCodeModelPointer, json: any): void {
    // Do nothing as now the events are already splitted per subItems
  /*  if ((typeof(json) === 'object') && (this.provider)) {
      let change: Change;
      const schemaManager = this.provider.getSchemaManager();
      for (const prop in json) {
        if (json.hasOwnProperty(prop)) {
          const subPropertyPointer = schemaManager.generateSubSchemaPointer(pointer, prop);
          const propType = schemaManager.locateItem(subPropertyPointer.positionInSchema);
          if ((propType?.isArray()) && (subPropertyPointer.isProperty)) {
            this.decomposeJsonToMultipleChanges(subPropertyPointer, json[prop]);
          } else {
            change = new Change(
              ChangeType.ADD,
              pointer.position + '/' + prop,
              json[prop],
              subPropertyPointer);
            if ((!propType) && (change.pointer)) {
              // This is not a sub property but a subItem of an array
              //change.pointer.itemId = change.pointer.key;
              change.pointer.isProperty = false;
            }

            if (this.changeHandler)
              this.changeHandler.handleChange(change);
          }
        }
      }
    }*/
  }

  /**
   * Calls handleChange each time a change event for any element below this (as per the model's position) is received
   * @protected
   */
  initChangeListening() {
    if ((this.provider) && (this.entityPointer)) {
      this.subscriptions.add(this.provider.receiveCommands(this.entityPointer.position).pipe(
        map(change => {
          if (this.changeHandler)
            this.changeHandler.handleChange(change);
        }))
        .subscribe()
      );
    } else {
      throw new Error('Cannot listen to change before initCommandFlow is called');
    }

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
  applyUpdatesToArray<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string, transform: (position: DontCodeModelPointer, item: any) => T, applyProperty?: (target: T, key: string, value: any) => boolean): Promise<T[]> {
    return this.applyUpdatesToArrayAsync(target, targetMap, change, property, (key, item) => {
      return Promise.resolve(transform(key, item));
    });
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
  applyUpdatesToArrayAsync<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string | null, transform: (position: DontCodeModelPointer, item: any) => Promise<T>, applyProperty?: (target: T, key: string | null, value: any) => boolean): Promise<T[]> {
    if (!this.provider)
      throw new Error('Cannot apply updates before initCommandFlow is called');
    if (!change.pointer) {
      change.pointer = this.provider.calculatePointerFor(change.position);
    }
    const itemId = change.pointer.calculateItemIdOrContainer();
    let futureTarget: Observable<T> | null = null;
    let newTarget: T | null = null;
    let pos = -1;
    let targetPos = -1;

    if ((itemId) && (targetMap.has(itemId))) {  // Does the target item already exist ?
      pos = targetMap.get(itemId) as number;
      newTarget = target[pos];
      futureTarget = of(newTarget);
    }
    if (change.beforeKey) {
      targetPos = targetMap.get(change.beforeKey) as number;
    }

    switch (change.type) {
      case ChangeType.ADD:
      case ChangeType.UPDATE:
        if (change.pointer.isProperty === true)  // It's not a replacement of the item but a change in one of its property
        {
          // Can we try to update directly the sub property?
          if ((!newTarget) || (
            (newTarget) &&
            ((!applyProperty)
              || (!applyProperty(newTarget, change.pointer.lastElement, change.value))
            ))
          ) {
            // It cannot be dynamically updated by the caller, so we do a full replacement
            const fullValue = this.provider.getJsonAt(change.pointer.containerPosition as string);
            futureTarget = from(transform(this.provider.calculatePointerFor(change.pointer.containerPosition as string), fullValue));
          }
        } else {
          // The new value replace the old one
          futureTarget = from(transform(this.provider.calculatePointerFor(change.pointer.containerPosition as string), change.value));
        }
        break;
      case ChangeType.MOVE:
        if (pos !== -1) {
          // We delete the element moved, it will be inserted at the right position later
          if ((targetPos !== -1) && (targetPos > pos))
            targetPos--;
          target.splice(pos, 1);
          // Recalculate all indexes in targetMap
          targetMap.forEach((value, key) => {
            if (value > pos) {
              targetMap.set(key, value - 1);
            }
          });
          if (itemId)
            targetMap.delete(itemId);
          else
            throw new Error('Cannot move ' + change.position + ' without knowing the itemId');
          pos = -1;
        }
        break;
      case ChangeType.DELETE:
        target.splice(pos, 1);
        // Recalculate all indexes in targetMap
        targetMap.forEach((value, key) => {
          if (value > pos) {
            targetMap.set(key, value - 1);
          }
        });
        if (itemId)
          targetMap.delete(itemId);
        else
          throw new Error('Cannot delete ' + change.position + ' without knowing the itemId');
        futureTarget = null;
        break;
    }

    if (futureTarget) {
      return futureTarget.pipe(map(result => {

        if (pos !== -1) {
          // We just need to replace the new value at the same position
          target[pos] = result;
        } else if (targetPos !== -1) {
          // Insert the element at the correct position
          target.splice(targetPos, 0, result);
          // Recalculate all indexes in targetMap
          targetMap.forEach((value, key) => {
            if (value >= targetPos) {
              targetMap.set(key, value + 1);
            }
          });
          if (itemId)
            targetMap.set(itemId, targetPos);
          else
            throw new Error('Cannot set targetPos ' + targetPos + ' without knowing the itemId');

        } else {
          // Insert the element at the end
          target.push(result);
          if (itemId)
            targetMap.set(itemId, targetMap.size);
          else
            throw new Error('Cannot set targetPos ' + targetPos + ' without knowing the itemId');
        }
        return target;
      })).toPromise();
    } else {
      return Promise.resolve(target);
    }

  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

}
