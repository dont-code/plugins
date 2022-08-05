import { Component, Injector, OnDestroy } from '@angular/core';
import {
  Change,
  CommandProviderInterface, DontCodeModel,
  DontCodeModelPointer,
  PreviewHandler,
} from '@dontcode/core';
import { ComponentLoaderService } from '../common-dynamic/component-loader.service';
import { AbstractDynamicLoaderComponent } from './abstract-dynamic-loader-component';
import { PluginHandlerHelper } from '../common-handler/plugin-handler-helper';
import { Subscription } from 'rxjs';
import {DynamicComponent} from "./dynamic-component";
import {FormControl, Validators} from "@angular/forms";

/**
 * A component that can be loaded by the framework, load subcomponents, listen to model changes, and so on...
 * It can as well dynamically manage a list of subcomponents and a form together with its mapping to a value.
 */
@Component({ template: '' })
export abstract class PluginBaseComponent
  extends AbstractDynamicLoaderComponent
  implements PreviewHandler, OnDestroy
{
  protected subscriptions = new Subscription();
  protected pluginHelper = new PluginHandlerHelper();
  entityPointer: DontCodeModelPointer | null = null;
  protected provider: CommandProviderInterface | null = null;

  /**
   * Manages the components that are bound to the form
   */
  fields = new Array<FormElement>();
  fieldsMap = new Map<string, number>();

  constructor(loader: ComponentLoaderService, injector: Injector) {
    super(loader, injector);
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe();
  }

  protected forceUnsubscribe(): void {
    this.pluginHelper.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  /**
   * Propagate the values to the form if needed
   * @param val
   */
  override setValue(val: any) {
    super.setValue(val);

    if (val) {
      // Transforms the stored values into field values
      this.fields.forEach((field) => {
        if (field.component?.managesFormControl()) {
          field.component.setValue(this.value[field.name]);
        } else {
          if (this.form) {
            const singleVal: { [key: string]: any } = {};
            let updatedValue=this.value[field.name];
            if (field.component!=null) {
              updatedValue = field.component.transformFromSource (field?.type,this.value[field.name]);
            } else {
              // No components will manage the value, so let's transform it to a displayable string
              updatedValue = PluginBaseComponent.toBeautifyString(updatedValue);
            }
            singleVal[field.name] = updatedValue;
            this.form.patchValue(singleVal, { emitEvent: false });
          }
        }
      });
    } else {
      this.form?.reset({}, { emitEvent: false });
    }

  }

  /**
   * Listen to this.form updates and update this.value accordingly
   * @protected
   */
  protected updateValueOnFormChanges():void {
    this.subscriptions.add(this.form.valueChanges.subscribe((change) => {
      if (this.value) {
        for (const changeKey in change) {
          if (change.hasOwnProperty(changeKey)) {
            const field = this.fields.find((toSearch) => {
              if (toSearch.name === changeKey) return true;
              else return false;
            });
            let newVal = change[changeKey];
            if (field?.component!=null) {
              if (field.component.managesFormControl()) {
                newVal = field.component.getValue();
              } else {
                newVal = field.component.transformToSource(field.type, newVal);
              }
            }
            this.value[changeKey] = newVal;
          }
        }
        //console.log(this.value);
      }
    })
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
    return this.pluginHelper.applyUpdatesToArrayAsync(
      target,
      targetMap,
      change,
      property,
      transform,
      applyProperty
    );
  }

  abstract handleChange(change: Change): void;

  /**
   * Dynamically manages the list of subFields (and sub components) based on the change.
   * @param change
   * @protected
   */
  protected updateSubFieldsWithChange(change: Change, subProperty:string|null): Promise<FormElement[]|null> {
      return this.applyUpdatesToArrayAsync(
        this.fields,
        this.fieldsMap,
        change,
        subProperty,
        (position, value) => {
          return this.loadSubComponent(position, value).then((component) => {
            if (component) {
              component.setName(value.name);
              component.setForm(this.form);
            }
            return new FormElement(value.name, value.type, component);
          });
        },
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
    // Updates the formgroup with new fields and remove old fields if necessary
    const toRemove = new Set<string>();
    // tslint:disable-next-line:forin
    for (const formKey in this.form.controls) {
      toRemove.add(formKey);
    }

    this.fields.forEach((field) => {
      let val = null;
      if (this.value && this.value[field.name]) {
        val = this.value[field.name];
      }
      toRemove.delete(field.name);
      field.component?.setValue(val);

      // Check if the component manages the FormControl itself or if it relies on us
      if (!field.component?.managesFormControl()) {
        if (field.component!=null) {
          val = field.component.transformFromSource(field.type, val);
        } else {
          val = PluginBaseComponent.toBeautifyString(val);
        }
        this.form.registerControl(
          field.name,
          new FormControl(val, Validators.required)
        );
      }
    });

    toRemove.forEach((key) => {
      this.form.removeControl(key);
    });
  }

  protected applyTransformationFromSource (fieldType:string, comp:DynamicComponent|null, value:unknown): unknown {
    if (comp!=null) {
      return comp.transformToSource(fieldType, value);
    } else if (fieldType==="Text") {
        return PluginBaseComponent.toBeautifyString (value);
    } else
      return value;
  }

  /**
   * Returns a string that can best display the value or null if it's already a string
   * @param value
   */
  public static toBeautifyString (value:unknown, maxLength?:number): string {
    let ret="";

    if ( Array.isArray(value)) {
      value = value[0];
    }
    // Try to see if we have json or Date or something else
    switch (typeof value) {
      case "string": {
        ret = value;
        break;
      }
      case "object": {
        if (value instanceof Date) {
          ret = value.toLocaleDateString();
        } else {
          ret = JSON.stringify(value, null, 2);
        }
        break;
      }
      case "undefined": {
        break;
      }
      default: {
        if( value!=null)
          ret = (value as any).toLocaleString();
      }
    }

    if( maxLength!=null) {
      if (ret.length> maxLength) {
        ret = ret.substring(0,maxLength-3)+'...';
      }
    }

    return ret;
  }



}

/**
 * Stores information about an element in the form
 */
export class FormElement {
  type: string;
  name: string;
  component: DynamicComponent | null;

  constructor(name: string, type: string, component: DynamicComponent | null) {
    this.name = name;
    this.type = type;
    this.component = component;
  }
}
