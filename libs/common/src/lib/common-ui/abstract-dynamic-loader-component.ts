import {AbstractDynamicComponent} from './abstract-dynamic-component';
import {DynamicComponent} from './dynamic-component';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  Injector,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {DontCodeModelPointer} from '@dontcode/core';
import {FormGroup} from '@angular/forms';
import {ComponentLoaderService} from '../common-dynamic/component-loader.service';
import {ReplaySubject} from "rxjs";

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

  /**
   * Manages the components that are bound to the form
   */
  protected fields = new Array<SubFieldInfo>();
  /**
   * Stores the position of subField in fields depending on its name
   * @protected
   */
  protected fieldsMap = new Map<string, number>();
  protected parentForm: FormGroup|null = null;

  /**
   * Any action that needs to happen after ngAfterViewInit can be added to this.
   * @protected
   */
  protected componentInited = new ReplaySubject<boolean> ();

  protected constructor(
    protected loader: ComponentLoaderService,
    protected injector: Injector,
    protected ref: ChangeDetectorRef
  ) {
    super();
  }


  /**
   * Define that a subvalue named propertyAndFormName will be managed by a subcomponent of type type
   * Example: defineSubFields ('currencyCode', 'Currency') will handle a plugin to manage the currency
   * @param formName
   * @param type
   */
  defineSubField (propertyAndFormName:string, type:string) {
    const newSubField = new SubFieldInfo(propertyAndFormName, type);
    this.addSubField(newSubField);
  }

  /**
   * Retrieve the information of the subfield at the given name.
   * @param propertyAndFormName
   * @protected
   */
  protected getSubField (propertyAndFormName:string): SubFieldInfo|undefined {
    const pos = this.fieldsMap.get(propertyAndFormName);
    if (pos!=null)
      return this.fields[pos];
    else
      return;
  }

  protected addSubField (toAdd:SubFieldInfo): number {
    const pos = this.fields.push( toAdd);
    this.fieldsMap.set(toAdd.name, pos-1);
    return pos;
  }

  getSubFields (): SubFieldInfo[] {
    return this.fields;
  }

  /**
   * This component will load subfields, so unless it doesn't have a name, it creates a new FormGroup
   * @param form
   */
  override setForm(form: FormGroup): void {
      // Register a FormGroup for this component has it will have to manage values from subFields as well
    if (this.name) {
      const formGroup = new FormGroup({}, { updateOn: 'blur' });
      form.registerControl(this.name, formGroup);
      super.setForm(formGroup);
      this.parentForm = form;
    } else {
      super.setForm(form);
      this.parentForm = null;
    }
    this.preloadSubFields();
  }

  override hydrateValueToForm() {
      // Don't try to update the form as if it is a standard component
      // as most likely we have created a new FormGroup
    if (this.parentForm==null)
      super.hydrateValueToForm();
    else {
      let formValue = this.transformToFormGroupValue(this.value);
      // Sets the form value that are not managed directly by a field
      for (const key in this.form.controls) {
        if (this.fieldsMap.get(key)==null) {
          const control = this.form.get(key);
          control?.setValue(formValue?formValue[key]:formValue, {emitEvent: false});
        }
      }
    }
  }

  override updateValueFromForm(): boolean {
    if (this.parentForm==null)
      return super.updateValueFromForm();
    else {
      let isChanged = false;
      // Sets the form value that are not managed directly by a field
      for (const key in this.form.controls) {
        if (this.fieldsMap.get(key) == null) {
          const control = this.form.get(key);
          if( control!=null) {
            if( control.dirty) {
              const value = this.transformFromFormGroupValue(control?.value);
              if (this.value==null) {
                this.value={};
              }
              this.value[key]=value;
              isChanged=true;
              control.markAsPristine({onlySelf: true});
            }
          }
        }
      }
      return isChanged;
    }
  }

  override setValue(val: any) {
    super.setValue(val);

      // Split the value into its subcomponents
    for (const element of this.fields) {
      if (val!=null)
        this.setSubFieldValue(element, val[element.name]);
      else
        this.setSubFieldValue(element, undefined);
    }
  }


  override getValue(): any {
    let val = super.getValue();
    // Adds subfield values into the main value
    for (const element of this.fields) {
      const subFieldValue = this.getSubFieldValue(element);
      if( (subFieldValue!=null) && (val==null)) {
        this.value={};
        val=this.value;
      }
      if( val[element.name]!==subFieldValue)
        val[element.name]=subFieldValue;
    }
    return val;
  }


  /**
   * Retrieve the fulledittemplate for a subfield
   * * @param formName
   */
  subFieldFullEditTemplate (subField:string|SubFieldInfo): TemplateRef<any> | null {
    const subInfo = (typeof subField === 'string')?this.getSubField(subField as string):subField as SubFieldInfo;
    const component = subInfo?.component;
    let ret= null;
    if (component!=null) {
      ret = component.providesTemplates(subInfo?.type).forFullEdit;
    }
    if( subField==null)
      throw new Error ("No template for subField "+subInfo?.name+" of component "+this.name);
    else
      return ret;
  }

  /**
   * Retrieve the fulledittemplate for a subfield
   * * @param formName
   */
  subFieldInlineViewTemplate (subField:string|SubFieldInfo): TemplateRef<any> | null {
    const subInfo = (typeof subField === 'string')?this.getSubField(subField as string):subField as SubFieldInfo;
    const component = subInfo?.component;
    let ret= null;
    if (component!=null) {
      ret = component.providesTemplates(subInfo?.type).forInlineView;
    }
    if( subField==null)
      throw new Error ("No template for subField "+subInfo?.name+" of component "+this.name);
    else
      return ret;
  }

  /**
   * Retrieve the fullviewtemplate for a subfield
   * * @param formName
   */
  subFieldFullViewTemplate (subField:string|SubFieldInfo): TemplateRef<any> | null {
    const subInfo = (typeof subField === 'string')?this.getSubField(subField as string):subField as SubFieldInfo;
    const component = subInfo?.component;
    let ret= null;
    if (component!=null) {
      ret = component.providesTemplates(subInfo?.type).forFullView;
    }
    if( subField==null)
      throw new Error ("No template for subField "+subInfo?.name+" of component "+this.name);
    else
      return ret;
  }

  /**
   * Dynamically loads the component to handle the subfield
   * @param formName
   * @param type
   * @param subValue
   */
  loadSubField(
    subField: string | SubFieldInfo,
    type: string,
    subValue: any
  ): Promise<DynamicComponent | null> {
    const subInfo = (typeof subField === 'string')?this.getSubField(subField as string):subField as SubFieldInfo;
    const component = subInfo?.component;
    if (component == null) {
      return this.loader
        .insertComponentForFieldType(type, this.dynamicInsertPoint)
        .then((component) => {
          if (component!=null) {
            this.prepareComponent(component, type,(subInfo!=null)?subInfo.name:null, subValue);
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
  getSubFieldValue(subField: string | SubFieldInfo): any {
    const subInfo = (typeof subField === 'string')?this.getSubField(subField as string):subField as SubFieldInfo;
    const component = subInfo?.component;
    if (component!=null) {
      return component.getValue();
    } else {
      // No component is handling this subField so we have to do it ourselves
      if ((this.form!=null)&&(subInfo!=null)) {
        return this.form.get(subInfo.name)?.value;
      } else {
        throw new Error(
          'Cannot provide value for non existent subField ' + subField
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
  setSubFieldValue(subField: string|SubFieldInfo, val: any) {
    const subInfo = (typeof subField === 'string')?this.getSubField(subField as string):subField as SubFieldInfo;
    const component = subInfo?.component;
    // Sometimes no subcomponent is loaded, for example when displaying value only
    if (component!=null) {
        component.setValue(val);
    }  else {
      // No components will manage the value, so let's transform it to a displayable string
      if ((this.form!=null) && (subInfo!=null)) {
        const singleVal: { [key: string]: any } = {};
        let updatedValue = AbstractDynamicLoaderComponent.toBeautifyString(val);
        if (updatedValue == undefined)  // You cannot set a value to undefined
          updatedValue = null;
        singleVal[subInfo.name] = updatedValue;
        this.form.patchValue(singleVal, {emitEvent: false});
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
    formName:string|null,
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
        //console.debug("LoadSubComponent:"+position.position+' with type '+type+', dynamicInsertPoint is ', (this.dynamicInsertPoint!=null));
        if (this.dynamicInsertPoint==null) {
          return null;
        }
        return this.loader
          .insertComponent(position, this.dynamicInsertPoint, currentJson)
          .then((component) => {
            if (component != null) {
              return this.prepareComponent(component, type, formName, currentJson);
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
      /*if (!this.form)
        throw new Error(
          'Cannot prepare a subField component without a FormGroup'
        );*/
      // Tells the component he's part of a form
      if (this.form!=null) {
        component.setName(formName);
        component.setForm(this.form);
      }
      component.setValue(subValue);

    }
    return component;
  }

  applyComponentToSubField (component: DynamicComponent, type:string, formName:string): boolean {
    let info =this.getSubField(formName);
    if( info==null) {
      info = new SubFieldInfo(formName, type, component);
      this.addSubField (info);
      return true;
    }else {
      info.component=component;
      return false;
    }
  }

  ngAfterViewInit(): void {
//    console.debug ("DynamicInsertPoint for "+this.constructor.name, this.dynamicInsertPoint);
    this.componentInited.complete();
    this.preloadSubFields();
  }

  private preloadSubFields(): void {
    if (this.dynamicInsertPoint!=null) {
      let detectCheckDone=false;
      for (const element of this.fields) {
        if( element.component==null) {
          const valueSafe =this.value?this.value[element.name]:undefined;
          this.loadSubField(
            element.name,
            element.type,
            valueSafe
          ).then((component) => {
            if (component!=null) {
              this.applyComponentToSubField(component, element.type, element.name);
            }
            if( (this.value!=null)&&(!detectCheckDone))
              {
                this.ref.detectChanges();
                detectCheckDone=true;
              }
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
  name: string;
  type: string;
  component: DynamicComponent | undefined;

  constructor(name:string, type:string, comp?:DynamicComponent) {
    this.name = name;
    this.type = type;
    this.component = comp;
  }

}
