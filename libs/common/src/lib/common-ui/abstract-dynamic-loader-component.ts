import {AbstractDynamicComponent} from "./abstract-dynamic-component";
import {DynamicComponent} from "./dynamic-component";
import {AfterViewInit, Component, ComponentFactory, Directive, ViewChild, ViewContainerRef} from "@angular/core";
import {DontCodeModelPointer} from "@dontcode/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ComponentLoaderService} from "../common-dynamic/component-loader.service";

/** A component must be attached to a insertionpoint in the template **/
@Directive({selector: 'dtcde-dynamic'})
export class DynamicInsertPoint {
}

/**
 * A component that can be dynamically loaded by the dont-code framework, and can dynamically load subcomponents
 * It can integrate with the reactive form or not depending on calling setForm () or not.
 *
 * Components that dynamically loads other components must at least define an insertion point by using this <dtcde-dynamic></dtcde-dynamic>
 */
@Component({template: ''})
export abstract class AbstractDynamicLoaderComponent extends AbstractDynamicComponent implements AfterViewInit{

  @ViewChild(DynamicInsertPoint, {read: ViewContainerRef, static:false}) dynamicInsertPoint!: ViewContainerRef;

  protected componentsByFormName = new Map<string, DynamicComponent> ();
  group: FormGroup|null = null;   // Manages the formGroup for all subcomponents

  protected constructor(protected loader: ComponentLoaderService) {
    super();
  }

  setForm(form: FormGroup): void {
    this.form=form;
    if (this.name) {
      this.group = new FormGroup({},{updateOn:'blur'});
      this.form.registerControl(this.name, this.group);
    }
  }

  loadSubField(type:string, formName:string, subValue:any): Promise<DynamicComponent> {
    return this.loader.loadComponentForFieldType(type).then (componentFactory => {
      if (componentFactory) {
        const comp= this.prepareComponent (componentFactory, formName, subValue);
        return comp;
      } else {
        throw Error ('No handler found for field '+type);
      }
    });
  }

  getSubFieldValue(formName: string): any {
    const component = this.componentsByFormName.get(formName);
    if (component?.managesFormControl()) {
      return component.getValue();
    } else {
      const subControl=this.group?.get(formName);
      if (subControl) {
        return subControl.value;
      } else {
        throw new Error ('Cannot provide value for non existent subField '+formName);
      }
    }
  }

  setSubFieldValue (formName:string, val: any) {
      const component = this.componentsByFormName.get(formName);
        // Sometimes no subcomponent is loaded, for example when displaying value only
      if( component) {
        if (component.managesFormControl()) {
          component.setValue(val);
        } else {
          if( this.group) {
            const newVal:{[key:string]:any} = {};
            newVal[formName] = val;
            this.group.patchValue(newVal, {emitEvent: false});
          } else {
            throw new Error ('Cannot setSubFieldValue for '+formName+' without the FormGroup defined');
          }
        }
      }
  }
    /**
   * Loads the component that will handle the display and edit for the item at the specified position
   * @param schemaPosition: Either the schemaPosition as string or as DontCodeModelPointer
   * @param currentJson
   */
  loadSubComponent(schemaPosition: DontCodeModelPointer|string, currentJson?: any): Promise<DynamicComponent|null> {
    return this.loader.loadComponentFactory(schemaPosition, currentJson).then (componentFactory => {
      if( componentFactory)
        return this.prepareComponent(componentFactory, null, currentJson);
      else
        return null;
    });
  }

  prepareComponent (factory: ComponentFactory<DynamicComponent>, formName:string|null, subValue:any): DynamicComponent {
    if( factory && this.dynamicInsertPoint) {
      const componentRef = this.dynamicInsertPoint.createComponent(factory);
      const component = componentRef.instance as DynamicComponent;

        // Manages dynamic forms if needed
      if (formName) {
        if( !this.group)
          throw new Error ('Cannot prepare a self managing control component without a FormGroup');
        component.setName(formName);
        component.setForm(this.group);

        if( !component.managesFormControl()) {
            this.group.registerControl(formName, new FormControl(subValue,{updateOn:'blur'}))
        } else {
          component.setValue(subValue);
        }
        this.componentsByFormName.set(formName, component);
      }
      return component;
    } else {
      throw new Error ('No ComponentFactory or missing <dtcde-dynamic></dtcde-dynamic> in template');
    }

  }

  ngAfterViewInit(): void {
    //console.log ("DynamicInsertPoint for "+this.name, this.dynamicInsertPoint);
  }

}
