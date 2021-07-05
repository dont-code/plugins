import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnInit,
  TemplateRef, ViewChild
} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {
  DynamicComponent,
  PluginBaseComponent,
  TemplateList,
  ComponentLoaderService,
  PossibleTemplateList
} from "@dontcode/plugin-common";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dontcode-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent extends PluginBaseComponent implements PreviewHandler, OnInit {

  value:any

  @Input("value") set _value(newval:any) {
    this.value = newval;
    if( this.value == null)
      this.value = {};
    if (this.form) {
      this.form.reset(this.value,{emitEvent:false});
    }

  }

  @ViewChild('defaulteditor')
  private defaultTemplate: TemplateRef<any>;

  initing = false;

  fields = new Array<FormElement>();
  fieldsMap = new Map<string, number>();

  form: FormGroup;
  formConfig = {};

  constructor(private ref:ChangeDetectorRef, protected fb:FormBuilder,protected componentFactoryResolver: ComponentFactoryResolver, componentLoader: ComponentLoaderService, injector: Injector) {
    super(componentLoader, injector);
  }

  ngOnInit(): void {
    this.form = this.fb.group({}, {updateOn:'blur'});
    this.form.valueChanges.subscribe(change => {
      if (this.value) {
        for (const changeKey in change) {
          if( change.hasOwnProperty(changeKey)) {
            const field = this.fields[this.fieldsMap.get(changeKey)];
            let newVal = change[changeKey];
            if (field) {
              newVal = field.component.overrideValue (newVal);
            }
            this.value[changeKey] = newVal;
          }
        }
        //console.log(this.value);
      }
    });
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    this.initing=true;
    super.initCommandFlow(provider, pointer);

    this.decomposeJsonToMultipleChanges (this.entityPointer, provider.getJsonAt(this.entityPointer.position)); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening (); // Listen to all changes occuring after entityPointer
    this.initing=false;
    this.rebuildForm();
  }

  /**
   * Updates the edit form whenever the fields of the entity are changed
   * @param change
   * @protected
   */
  protected handleChange(change: Change) {
    this.applyUpdatesToArrayAsync (this.fields, this.fieldsMap, change, null, (position,value) => {
      return this.loadSubComponent(position, value).then(component => {
        if( component)
          component.setName(value.name);
        return new FormElement(value.name, value.type, component);
      });
    }, (elt, key, newVal) => {
        switch (key) {
          case DontCodeModel.APP_FIELDS_NAME_NODE:
            elt.name = newVal;
            break;
          default:
            return false;
        }
        return true;
      }
      ).then (updatedFields => {
      this.fields = updatedFields;
      this.rebuildForm();
      this.ref.markForCheck();
      this.ref.detectChanges();

    });
  }

  /**
   * Rebuild the Reactive form from the list of fields configured with the entity
   * @private
   */
  private rebuildForm() {
      // Updates the formgroup with new fields and remove old fields if necessary
    const toRemove = new Set<string>();
    // tslint:disable-next-line:forin
    for (const formKey in this.form.controls) {
      toRemove.add(formKey);
    }

    this.fields.forEach(field => {
      let val=null;
      if((this.value)&&(this.value[field.name])) {
        val = this.value[field.name];
      }
      toRemove.delete(field.name);
      this.form.addControl(field.name, new FormControl(val, Validators.required));
    });

    toRemove.forEach(key => {
      this.form.removeControl(key);
    })

  }

  providesTemplates(): TemplateList {
    return null;
  }

  canProvide(key?: string): PossibleTemplateList {
    return null;
  }

  templateOf(field: FormElement): TemplateRef<any> {
    let ref= field.component?.providesTemplates(field.type).forFullEdit;
    if( !ref)
      ref = this.defaultTemplate;

    return ref;
  }
}

class FormElement {
  type: string;
  name: string;
  component: DynamicComponent;

  constructor(name:string,type:string, component:DynamicComponent) {
    this.name=name;
    this.type=type;
    this.component = component;
  }

}
