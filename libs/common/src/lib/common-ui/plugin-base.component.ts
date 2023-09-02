import {ChangeDetectorRef, Component, Injector, OnDestroy} from '@angular/core';
import {
  Change,
  CommandProviderInterface, DontCodeModel,
  DontCodeModelPointer,
  PreviewHandler,
} from '@dontcode/core';
import { ComponentLoaderService } from '../common-dynamic/component-loader.service';
import {AbstractDynamicLoaderComponent, SubFieldInfo} from './abstract-dynamic-loader-component';
import { PluginHandlerHelper } from '../common-handler/plugin-handler-helper';
import {debounceTime, Subscription} from 'rxjs';
import {DynamicComponent} from "./dynamic-component";
import {FormControl, Validators} from "@angular/forms";
import {map} from "rxjs/operators";

/**
 * A component that can be loaded by the framework, load subcomponents, listen to model changes, and so on...
 * It can as well dynamically manage a list of subcomponents and a form together with its mapping to a value.
 */
@Component({ template: '' })
export abstract class PluginBaseComponent
  extends AbstractDynamicLoaderComponent
  implements PreviewHandler, OnDestroy
{
  protected pluginHelper = new PluginHandlerHelper();
  entityPointer: DontCodeModelPointer | null = null;
  protected provider: CommandProviderInterface | null = null;

  constructor(loader: ComponentLoaderService, injector: Injector,ref: ChangeDetectorRef) {
    super(loader, injector, ref);
  }

  override ngOnDestroy(): void {
    this.pluginHelper.unsubscribe();
    super.ngOnDestroy();
  }

  /**
   * Listen to this.form updates and update this.value accordingly
   * @protected
   */
  protected updateValueOnFormChanges():void {
    this.subscriptions.add(this.form.valueChanges.pipe(
      map (value => {
        //console.debug("Value changed", value);
        // Force the recalculation of the data from the form
        this.getValue();
        return value;
      })
      ).subscribe()
    );
  }

  initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ): any {
    this.entityPointer = pointer;
    this.provider = provider;
    this.pluginHelper.initCommandFlow(provider, pointer, this);
  }

  protected initChangeListening(subElement?: boolean) {
    this.pluginHelper.initChangeListening(subElement);
  }

  /**
   * When the component is created for display, it receives the initial data as complete Json.
   * If it wants, it can call this method who will call handleChange for each property.
   * This will avoid to duplicate code (first time when a complete json is sent, second when subelements are sent)
   * @protected
   */
  protected decomposeJsonToMultipleChanges(
    pointer: DontCodeModelPointer,
    json: any
  ): void {
    this.pluginHelper.decomposeJsonToMultipleChanges(pointer, json);
  }

  /**
   * Retrieve the value of the key property if the change concerns it
   * @param change
   * @param key
   */
  decodeStringField(change: Change, key: string): string | undefined {
    if (change.pointer?.lastElement === key) {
      return change.value;
    } else return undefined;
  }

  /**
   * Updates the array of T elements by applying the changes received and calling the transform method
   * @param target
   * @param targetMap
   * @param change
   * @param property
   * @param transform
   * @param parentPosition
   * @param applyProperty
   * @private
   */
  applyUpdatesToArray<T>(
    target: T[],
    targetMap: Map<string, number>,
    change: Change,
    property: string,
    transform: (position: DontCodeModelPointer, item: any) => T,
    parentPosition?: string,
    applyProperty?: (target: T, key: string, value: any) => boolean
  ): Promise<T[]> {
    return this.applyUpdatesToArrayAsync(
      target,
      targetMap,
      change,
      property,
      (key, item) => {
        return Promise.resolve(transform(key, item));
      },
      parentPosition
    );
  }

  /**
   * Updates the array of T elements by applying the changes received and calling the transform method
   * @param target
   * @param targetMap
   * @param change
   * @param property
   * @param transform
   * @param parentPosition
   * @param applyProperty
   * @private
   */
  applyUpdatesToArrayAsync<T>(
    target: T[],
    targetMap: Map<string, number>,
    change: Change,
    property: string | null,
    transform: (position: DontCodeModelPointer, item: any) => Promise<T>,
    parentPosition?: string,
    applyProperty?: (target: T, key: string | null, value: any) => boolean
  ): Promise<T[]> {
    return this.pluginHelper.applyUpdatesToArrayAsync(
      target,
      targetMap,
      change,
      property,
      transform,
      parentPosition,
      applyProperty
    );
  }

  abstract handleChange(change: Change): void;

  /**
   * Dynamically manages the list of subFields (and sub components) based on the change.
   * @param change
   * @protected
   */
  protected updateSubFieldsWithChange(change: Change, subProperty:string|null, parentPosition?: string): Promise<SubFieldInfo[]|null> {
      return this.applyUpdatesToArrayAsync(
        this.fields,
        this.fieldsMap,
        change,
        subProperty,
        (position, value) => {
          return this.loadSubComponent(position, value.type, value.name).then((component) => {
            return new SubFieldInfo(value.name, value.type, component??undefined);
          });
        },
        parentPosition,
        (elt, key, newVal) => {
          switch (key) {
            case DontCodeModel.APP_FIELDS_NAME_NODE:
              elt.name = newVal;
              break;
            default:
              return false;
          }
          return true;
        }
      ).then((updatedFields) => {
        this.fields = updatedFields;
        this.rebuildForm();
        return updatedFields;
      });
  }

  /**
   * Rebuild the Reactive form from the list of fields configured with the entity
   * @protected
   */
  protected rebuildForm() {

    if (this.form==null)  // Ignore if the component doesn't have a form
      return;
    // Updates the formgroup with new fields and remove old fields if necessary
    const toRemove = new Set<string>();
    // tslint:disable-next-line:forin
    for (const formKey in this.form.controls) {
      toRemove.add(formKey);
    }

    for (const field of this.fields) {
      let val = null;
      if (this.value && this.value[field.name]) {
        val = this.value[field.name];
      }
      toRemove.delete(field.name);

      // Check if the component manages the FormControl itself or if it relies on us
      if (field.component!=null) {
        field.component?.setValue(val);
      } else {
        val = PluginBaseComponent.toBeautifyString(val);
        this.form.registerControl(
          field.name,
          new FormControl(val, Validators.required)
        );
      }
    }

    toRemove.forEach((key) => {
      this.form.removeControl(key);
    });
  }

}
