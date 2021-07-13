import {from, Observable, of, Subscription} from "rxjs";
import {Component, Injector, OnDestroy} from "@angular/core";
import {Change, ChangeType, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {map} from "rxjs/operators";
import {ComponentLoaderService} from "../common-dynamic/component-loader.service";
import {AbstractDynamicLoaderComponent} from "./abstract-dynamic-loader-component";

/**
 * A component that can be loaded by the framework, load subcomponents, listen to model changes, and so on...
 * Usually provided by plugins and run by the framework
 */
@Component({template: ''})
export abstract class PluginBaseComponent extends AbstractDynamicLoaderComponent implements PreviewHandler, OnDestroy {
  protected subscriptions = new Subscription();
  entityPointer: DontCodeModelPointer|null=null
  provider: CommandProviderInterface|null=null;


  constructor(loader: ComponentLoaderService) {
    super(loader);
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
  protected decomposeJsonToMultipleChanges(pointer: DontCodeModelPointer, json: any): void {
    if ((json)&&(this.provider)) {
      let change: Change;
      const schemaManager = this.provider.getSchemaManager();
      for (const prop in json) {
        if( json.hasOwnProperty(prop)) {
          const subPropertyPointer = schemaManager.generateSubSchemaPointer(pointer, prop);
          const propType = schemaManager.locateItem(subPropertyPointer.schemaPosition);
          if ((propType?.isArray()) &&( !subPropertyPointer.itemId)) {
            this.decomposeJsonToMultipleChanges(subPropertyPointer, json[prop]);
          } else {
            change = new Change(
              ChangeType.ADD,
              pointer.position + '/' + prop,
              json[prop],
              subPropertyPointer);
            if ((!propType)&&(change.pointer)) {
              // This is not a sub property but a subItem of an array
              change.pointer.itemId = change.pointer.key;
              change.pointer.key = null;
            }

            this.handleChange(change);
          }
        }
      }
    }
  }

  /**
   * Calls handleChange each time a change event for any element below this (as per the model's position) is received
   * @protected
   */
  protected initChangeListening() {
    if ((this.provider) && (this.entityPointer)) {
      this.subscriptions.add(this.provider.receiveCommands(this.entityPointer.position).pipe(
        map(change => {
          this.handleChange(change);
        }))
        .subscribe()
      );
    } else {
      throw new Error ('Cannot listen to change before initCommandFlow is called');
    }

  }

  /**
   * This is where components react to changes received
   * @param change
   * @protected
   */
  protected handleChange(change: Change) {

  }

  /**
   * Retrieve the value of the key property if the change concerns it
   * @param change
   * @param key
   */
  decodeStringField(change: Change, key: string): string|undefined {
    if (change.pointer?.key === key) {
      return change.value;
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
  applyUpdatesToArray<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string, transform: (position: DontCodeModelPointer, item: any) => T, applyProperty?: (target: T, key: string, value: any) => boolean): Promise<T[]> {
     return this.applyUpdatesToArrayAsync(target, targetMap, change, property, (key, item) => {
        return Promise.resolve( transform(key, item));
      } );
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
  applyUpdatesToArrayAsync<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string|null, transform: (position: DontCodeModelPointer, item: any) => Promise<T>, applyProperty?: (target: T, key: string|null, value: any) => boolean): Promise<T[]> {
    if (!this.provider)
      throw new Error('Cannot apply updates before initCommandFlow is called');
    if (!change.pointer) {
      change.pointer = this.provider.calculatePointerFor(change.position);
    }
    const itemId = change.pointer.calculateItemIdOrContainer();
    let futureTarget: Observable<T>|null = null;
    let newTarget: T|null = null;
    let pos = -1;
    let targetPos = -1;

    if ((itemId)&&(targetMap.has(itemId))) {  // Does the target item already exist ?
      pos = targetMap.get(itemId) as number;
      newTarget = target[pos];
      futureTarget = of (newTarget);
    }
    if (change.beforeKey) {
      targetPos = targetMap.get(change.beforeKey) as number;
    }

    switch (change.type) {
      case ChangeType.ADD:
      case ChangeType.UPDATE:
        if (change.pointer.itemId == null)  // It's not a replacement of the item but a change in one of its property
        {
          // Can we try to update directly the sub property?
          if ((!newTarget) || (
            (newTarget) &&
            ((!applyProperty)
              || (!applyProperty(newTarget, change.pointer.key, change.value))
            ))
          ) {
            // It cannot be dynamically updated by the caller, so we do a full replacement
            const fullValue = this.provider.getJsonAt(change.pointer.containerPosition as string);
            futureTarget = from (transform(this.provider.calculatePointerFor(change.pointer.containerPosition as string), fullValue));
          }
        } else {
          // The new value replace the old one
          futureTarget = from (transform(this.provider.calculatePointerFor(change.pointer.containerPosition as string), change.value));
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
            throw new Error ('Cannot move '+change.position+' without knowing the itemId');
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
        if( itemId)
          targetMap.delete(itemId);
        else
          throw new Error ('Cannot delete '+change.position+' without knowing the itemId');
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
          if( itemId)
            targetMap.set(itemId, targetPos);
          else
            throw new Error ('Cannot set targetPos '+targetPos+' without knowing the itemId');

        } else {
          // Insert the element at the end
          target.push(result);
          if( itemId)
            targetMap.set(itemId, targetMap.size);
          else
            throw new Error ('Cannot set targetPos '+targetPos+' without knowing the itemId');
        }
        return target;
      })).toPromise();
    } else {
      return Promise.resolve(target);
    }

  }

}
