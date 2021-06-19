import {from, Observable, of, Subscription} from "rxjs";
import {Component, Directive, Injector, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {Change, ChangeType, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {map} from "rxjs/operators";
import {PossibleTemplateList, TemplateList} from "./template-list";
import {DynamicComponent} from "./dynamic-component";
import {ComponentLoaderService} from "../common-dynamic/component-loader.service";

@Directive({selector: 'dtcde-dynamic'})
export class DynamicInsertPoint {
}

@Component({template: ''})
export abstract class PluginBaseComponent implements DynamicComponent, PreviewHandler, OnDestroy {
  protected subscriptions = new Subscription();
  entityPointer: DontCodeModelPointer;
  provider: CommandProviderInterface;

  @ViewChild(DynamicInsertPoint, {read: ViewContainerRef}) dynamicInsertPoint: ViewContainerRef;

  constructor(protected loader: ComponentLoaderService, protected injector: Injector) {
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
    if (json) {
      let change: Change;
      const schemaManager = this.provider.getSchemaManager();
      for (const prop in json) {
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
          if (!propType) {
            // This is not a sub property but a subItem of an array
            change.pointer.itemId = change.pointer.key;
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
  protected initChangeListening() {
    this.subscriptions.add(this.provider.receiveCommands(this.entityPointer.position).pipe(
      map(change => {
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
  protected handleChange(change: Change) {

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
  applyUpdatesToArrayAsync<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string, transform: (position: DontCodeModelPointer, item: any) => Promise<T>, applyProperty?: (target: T, key: string, value: any) => boolean): Promise<T[]> {
    const itemId = change.pointer.calculateItemIdOrContainer();
    let futureTarget: Observable<T> = null;
    let newTarget: T = null;
    let pos = -1;
    let targetPos = -1;

    if (targetMap.has(itemId)) {  // Does the target item already exist ?
      pos = targetMap.get(itemId);
      newTarget = target[pos];
      futureTarget = of (newTarget);
    }
    if (change.beforeKey) {
      targetPos = targetMap.get(change.beforeKey);
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
            const fullValue = this.provider.getJsonAt(change.pointer.containerPosition);
            futureTarget = from (transform(this.provider.calculatePointerFor(change.pointer.containerPosition), fullValue));
          }
        } else {
          // The new value replace the old one
          futureTarget = from (transform(this.provider.calculatePointerFor(change.pointer.containerPosition), change.value));
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
          targetMap.delete(itemId);
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
        targetMap.delete(itemId);
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
          targetMap.set(itemId, targetPos);
        } else {
          // Insert the element at the end
          target.push(result);
          targetMap.set(itemId, targetMap.size);
        }
        return target;
      })).toPromise();
    } else {
      return Promise.resolve(target);
    }

  }

  /**
   * Loads the component that will handle the display and edit for the item at the specified position
   * @param position
   * @param currentJson
   */
  loadSubComponent(position: DontCodeModelPointer, currentJson?: any): Promise<DynamicComponent> {
    return this.loader.loadComponentFactory(position, this.provider, currentJson).then (componentFactory => {
      if( componentFactory) {
        const componentRef = this.dynamicInsertPoint.createComponent(componentFactory);
        const handler = componentRef.instance as DynamicComponent;
        return handler;
      } else {
        // Let's try to find the closest ancestor that is an object. Maybe we'll find a component for it and it will
        return null;
      }
    });
  }

  abstract providesTemplates(): TemplateList;
  abstract canProvide(key?: string): PossibleTemplateList;

  setName(name: string): void {
  }

  setValue(val: any): void {
  }

}
