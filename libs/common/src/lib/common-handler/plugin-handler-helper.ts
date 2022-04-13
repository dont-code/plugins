import {
  Change,
  ChangeType,
  CommandProviderInterface,
  DontCodeModelPointer,
  PreviewHandler,
} from '@dontcode/core';
import {catchError, first, flatMap, last, map, takeLast} from 'rxjs/operators';
import {firstValueFrom, from, Observable, of, Subscription} from 'rxjs';
import { Mutex } from 'async-mutex';

export class PluginHandlerHelper {
  protected subscriptions = new Subscription();

  entityPointer: DontCodeModelPointer | null = null;
  provider: CommandProviderInterface | null = null;
  changeHandler!: PreviewHandler;
  mutex = new Mutex();

  initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer,
    changeHandler: PreviewHandler
  ): any {
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
  decomposeJsonToMultipleChanges(
    pointer: DontCodeModelPointer,
    json: any
  ): void {
    // Do nothing as now the events are already splitted per subItems
    if (typeof json === 'object' && this.provider) {
      let change: Change;
      const schemaManager = this.provider.getSchemaManager();
      for (const prop in json) {
        if (json.hasOwnProperty(prop)) {
          const subPropertyPointer = schemaManager.generateSubSchemaPointer(
            pointer,
            prop
          );
          const propType = schemaManager.locateItem(
            subPropertyPointer.positionInSchema
          );
          if (propType?.isArray() && subPropertyPointer.isProperty) {
            this.decomposeJsonToMultipleChanges(subPropertyPointer, json[prop]);
          } else {
            change = new Change(
              ChangeType.RESET,
              pointer.position + '/' + prop,
              json[prop],
              subPropertyPointer
            );
            if (!propType && change.pointer) {
              // This is not a sub property but a subItem of an array
              //change.pointer.itemId = change.pointer.key;
              change.pointer.isProperty = false;
            }

            if (this.changeHandler) this.changeHandler.handleChange(change);
          }
        }
      }
    }
  }

  /**
   * Calls handleChange each time a change event for any element below this (as per the model's position) is received
   * @protected
   */
  initChangeListening(subElement?: boolean) {
    if (this.provider && this.entityPointer) {
      let filter = this.entityPointer.position;
      if (subElement !== true) filter += '/?';
      this.subscriptions.add(
        this.provider
          .receiveCommands(filter)
          .pipe(
            map((change) => {
              if (this.changeHandler) {
                this.changeHandler.handleChange(change);
              }
            })
          )
          .subscribe()
      );
    } else {
      throw new Error(
        'Cannot listen to change before initCommandFlow is called'
      );
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
  applyUpdatesToArray<T>(
    target: T[],
    targetMap: Map<string, number>,
    change: Change,
    property: string,
    transform: (position: DontCodeModelPointer, item: any) => T,
    applyProperty?: (target: T, key: string, value: any) => boolean
  ): Promise<T[]> {
    return this.applyUpdatesToArrayAsync(
      target,
      targetMap,
      change,
      property,
      (key, item) => {
        return Promise.resolve(transform(key, item));
      }
    );
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
  applyUpdatesToArrayAsync<T>(
    target: T[],
    targetMap: Map<string, number>,
    change: Change,
    property: string | null,
    transform: (position: DontCodeModelPointer, item: any) => Promise<T>,
    applyProperty?: (target: T, key: string | null, value: any) => boolean
  ): Promise<T[]> {
    // We have the mutex to avoid multiple changes checking the map and target array at the same time...
    return this.mutex.acquire().then((release) => {
      try {
        if (!this.provider)
          throw new Error(
            'Cannot apply updates before initCommandFlow is called'
          );
        if (!change.pointer) {
          change.pointer = this.provider.calculatePointerFor(change.position);
        }
        // If the change concerns the array, then calculates it's element (itemId)
        let parentPosition = this.entityPointer?.position;
        if (property != null) parentPosition = parentPosition + '/' + property;
        const subItem = change.pointer.containerPosition === parentPosition;
        let itemId = subItem
          ? change.pointer.lastElement
          : DontCodeModelPointer.lastElementOf(
              change.pointer.containerPosition
            ) ?? null;

        let propertyId = change.pointer.isProperty
          ? change.pointer.lastElement
          : null;
        let futureTarget: Observable<T> | null = null;
        let newTarget: T | null = null;
        let pos = -1;
        let targetPos = -1;

        if (itemId != null && targetMap.has(itemId)) {
          // Does the target item already exist ?
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
          case ChangeType.RESET:
            if (propertyId != null) {
              // It's not a replacement of the item but a change in one of its property
              // Can we try to update directly the sub property?
              if (
                !newTarget ||
                (newTarget &&
                  (!applyProperty ||
                    !applyProperty(newTarget, propertyId, change.value)))
              ) {
                // It cannot be dynamically updated by the caller, so we do a full replacement
                const fullValue = this.provider.getJsonAt(
                  change.pointer.containerPosition as string
                );
                //if (change.value!==fullValue[propertyId]) { Don't check as the new value as already been set in the json
                const parentPointer = this.provider.calculatePointerFor(
                  change.pointer.containerPosition as string
                );
                if (parentPointer.isProperty)
                  throw new Error(
                    'A parent of a property ' +
                      change.pointer.position +
                      ' must be an array'
                  );
                futureTarget = from(transform(parentPointer, fullValue));
                /*                      }else {
                        // We set the same value, so nothing changed
                        futureTarget = null;
                      }*/
              }
            } else {
              // The new value replace the old one
              futureTarget = from(transform(change.pointer, change.value));
            }
            break;
          case ChangeType.MOVE:
            if (pos !== -1 && subItem && itemId) {
              // We delete the element moved, it will be inserted at the right position later
              if (targetPos !== -1 && targetPos > pos) targetPos--;
              target.splice(pos, 1);
              // Recalculate all indexes in targetMap
              targetMap.forEach((value, key) => {
                if (value > pos) {
                  targetMap.set(key, value - 1);
                }
              });
              targetMap.delete(itemId);
              pos = -1;
            }
            break;
          case ChangeType.DELETE:
            if (pos !== -1 && subItem && itemId) {
              target.splice(pos, 1);
              // Recalculate all indexes in targetMap
              targetMap.forEach((value, key) => {
                if (value > pos) {
                  targetMap.set(key, value - 1);
                }
              });
              targetMap.delete(itemId);
            }
            futureTarget = null;
            break;
        }

        if (futureTarget) {
          return firstValueFrom(futureTarget
            .pipe(
              map((result) => {
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
                  if (itemId != null) targetMap.set(itemId, targetPos);
                  else
                    throw new Error(
                      'Cannot set targetPos ' +
                        targetPos +
                        ' without knowing the itemId'
                    );
                } else {
                  // Insert the element at the end
                  target.push(result);
                  if (itemId != null) targetMap.set(itemId, targetMap.size);
                  else
                    throw new Error(
                      'Cannot set targetPos ' +
                        targetPos +
                        ' without knowing the itemId'
                    );
                }
                release();
                return target;
              }),
              takeLast(1),
              catchError((error) => {
                release();
                return Promise.reject(error);
              })
            )
          )
        } else {
          release();
          return Promise.resolve(target);
        }
      } catch (error) {
        release();
        return Promise.reject(error);
      }
    });
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }
}
