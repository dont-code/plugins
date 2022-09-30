import {AbstractDynamicComponent} from './abstract-dynamic-component';
import {DynamicComponent} from './dynamic-component';
import {AfterViewInit, Component, Directive, Injector, TemplateRef, ViewChild, ViewContainerRef,} from '@angular/core';
import {DontCodeModelPointer} from '@dontcode/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComponentLoaderService} from '../common-dynamic/component-loader.service';
import {Observable, ReplaySubject, Subscriber, Subscription} from "rxjs";

/** A component must be attached to a insertionpoint in the template **/
@Directive({ selector: 'dtcde-dynamic' })
export class DynamicInsertPoint {}

/**
 * A component that can be dynamically loaded by the dont-code framework, and can dynamically load subcomponents
 * It can integrate with the reactive form or not depending on calling setForm () or not.
 *
 * Components that dynamically loads other components must at least define an insertion point by using this <dtcde-dynamic></dtcde-dynamic>
 */
@Component({ template: '' })
export abstract class AbstractDynamicLoaderComponent
  extends AbstractDynamicComponent
  implements AfterViewInit
{
  @ViewChild(DynamicInsertPoint, { read: ViewContainerRef, static: false })
  dynamicInsertPoint!: ViewContainerRef;

  protected componentsByFormName = new Map<string, SubFieldInfo>();
  group: FormGroup | null = null; // Manages the formGroup for all subcomponents

  protected componentInited = new ReplaySubject<boolean> ();

  protected constructor(
    protected loader: ComponentLoaderService,
    protected injector: Injector
  ) {
    super();
  }

  override setForm(form: FormGroup): void {
    super.setForm(form);
      // Register a FormGroup for this component has it will have to manage values from subFields as well
    if (this.name) {
      this.group = new FormGroup({}, { updateOn: 'blur' });
      this.form.registerControl(this.name, this.group);
    } else {
      this.group = this.form; // No need to create a subgroup
    }
    this.preloadSubFields();
  }

  override setValue(val: any) {
    super.setValue(val);

      // Split the value into its subcomponents
    for (const element of this.componentsByFormName) {
      const name = element[0];
      const info=element[1];
      if (val!=null)
        this.setSubFieldValue(name, info.type, val[name]);
      else
        this.setSubFieldValue(name, info.type, undefined);
    }
  }

  override getValue(): any {
    const val= super.getValue();
    // Adds subfield values into the main value
    if (val!=null) {
      for (const element of this.componentsByFormName) {
        const name = element[0];
        const info = element[1];
        const subFieldValue = this.getSubFieldValue(name, info.type);
        val[name]=subFieldValue;
      }
    }
    return val;
  }

  /**
   * Retrieve the fulledittemplate for a subfield
   * * @param formName
   */
  subFieldFullEditTemplate (formName:string): TemplateRef<any> | null {
    const comp = this.componentsByFormName.get(formName)?.component;
    let ret= null;
    if (comp!=null) {
      ret = comp.providesTemplates().forFullEdit;
    }
    if( ret==null)
      throw new Error ("No template for subField "+formName+" of component "+this.name);
    else
      return ret;
  }

  /**
   * Retrieve the fulledittemplate for a subfield
   * * @param formName
   */
  subFieldInlineViewTemplate (formName:string): TemplateRef<any> | null {
    const comp = this.componentsByFormName.get(formName)?.component;
    let ret= null;
    if (comp!=null) {
      ret = comp.providesTemplates().forInlineView;
    }
    if( ret==null)
      throw new Error ("No template for subField "+formName+" of component "+this.name);
    else
      return ret;
  }

  /**
   * Define that a subvalue named propertyAndFormName will be managed by a subcomponent of type type
   * Example: defineSubFields ('currencyCode', 'Currency') will handle a plugin to manage the currency
   * @param formName
   * @param type
   */
  defineSubField (propertyAndFormName:string, type:string) {
    const newSubField = new SubFieldInfo(type);
    this.componentsByFormName.set(propertyAndFormName, newSubField);
  }

  /**
   * Dynamically loads the component to handle the subfield
   * @param formName
   * @param type
   * @param subValue
   */
  loadSubField(
    formName: string,
    type: string,
    subValue: any
  ): Promise<DynamicComponent | null> {
    const component = this.componentsByFormName.get(formName)?.component;
    if (component == null) {
      return this.loader
        .insertComponentForFieldType(type, this.dynamicInsertPoint)
        .then((component) => {
          if (component!=null) {
            this.prepareComponent(component, type,formName, subValue);
            return component;
          } else {
            return null;
          }
        });
    } else {
      return Promise.resolve(component);
    }
  }

  /**
   * Retrieve the subField value from the component handling it
   * @param formName
   * @param type
   */
  getSubFieldValue(formName: string, type:string): any {
    const component = this.componentsByFormName.get(formName)?.component;
    if (component?.managesFormControl()) {
      return component.getValue();
    } else {
      const subControl = this.group?.get(formName);
      if (subControl) {
        return subControl.value;
      } else {
        throw new Error(
          'Cannot provide value for non existent subField ' + formName
        );
      }
    }
  }

  /**
   * Programmatically sets the value of the component handling the subfield
   * @param formName
   * @param type
   * @param val
   */
  setSubFieldValue(formName: string, type:string, val: any) {
    const component = this.componentsByFormName.get(formName)?.component;
    // Sometimes no subcomponent is loaded, for example when displaying value only
    if (component) {
      if (component.managesFormControl()) {
        component.setValue(val);
      } else {
        if (this.group) {
          const newVal: { [key: string]: any } = {};
          val = component.transformFromSource (type, val);

          newVal[formName] = val;
          this.group.patchValue(newVal, { emitEvent: false });
        } else {
          throw new Error(
            'Cannot setSubFieldValue for ' +
              formName +
              ' without the FormGroup defined'
          );
        }
      }
    }
  }

  /**
   * Loads the component that will handle the display and edit for the item at the specified position
   * @param position: Either the schemaPosition as string or as DontCodeModelPointer
   * @param currentJson
   */
  loadSubComponent(
    position: DontCodeModelPointer,
    type:string,
    currentJson?: any
  ): Promise<DynamicComponent | null> {
      // Make sure you wait until the component itself is init (and the dynamicInsertPoint is valid)

    return new Promise<void>((resolve, reject) => this.componentInited.subscribe({
        complete: () => {
          resolve();
        },
        error: (err) => {
          reject(err);
        }
      })).then( () => {
//        console.debug("SubComponent:"+position.position, this.dynamicInsertPoint);
        if (this.dynamicInsertPoint==null) {
          return Promise.resolve(null);
        }
        return this.loader
          .insertComponent(position, this.dynamicInsertPoint, currentJson)
          .then((component) => {
            if (component != null) {
              return this.prepareComponent(component, type, null, currentJson);
            } else {
              //console.warn('No ComponentFactory or missing <dtcde-dynamic></dtcde-dynamic> in template');
              return null;
            }
          });
      });
  }

  prepareComponent(
    component: DynamicComponent,
    type:string,
    formName: string | null,
    subValue: any
  ): DynamicComponent {
    // Manages dynamic forms if needed
    if (formName) {
      if (!this.group)
        throw new Error(
          'Cannot prepare a self managing control component without a FormGroup'
        );
      component.setName(formName);
      component.setForm(this.group);

      if (!component.managesFormControl()) {
        subValue = component.transformFromSource (type,subValue);
        this.group.registerControl(
          formName,
          new FormControl(subValue, { updateOn: 'blur' })
        );
      } else {
        component.setValue(subValue);
      }
      let info =this.componentsByFormName.get(formName);
      if( info==null) {
        info = new SubFieldInfo(type);
        this.componentsByFormName.set(formName, info);
      }
      info.component=component;
    }
    return component;
  }

  ngAfterViewInit(): void {
//    console.debug ("DynamicInsertPoint for "+this.constructor.name, this.dynamicInsertPoint);
    this.componentInited.complete();
    this.preloadSubFields();
  }

  private preloadSubFields(): void {
    // Only load currency component to the cache in edit mode
    if ((this.group!=null)&&(this.dynamicInsertPoint!=null)) {
      for (const element of this.componentsByFormName) {
        const name = element[0];
        const info=element[1];
        if( info?.component==null) {
          const valueSafe =this.value?this.value[name]:undefined;
          this.loadSubField(
            name,
            info.type,
            valueSafe
          ).then(() => {
              // Nothing to do
          });
        }
      }
    }
  }

}

/**
 * Store information to configure a subfield
 */
export class SubFieldInfo {
  type: string;

  component: DynamicComponent | undefined;

  constructor(type:string) {
    this.type=type;
  }

}
