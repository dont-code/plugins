import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnInit,
  TemplateRef, ViewChild
} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
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
    if (this.form) {
      this.form.reset(this.value,{emitEvent:false});
    }

  }

  @ViewChild('defaulteditor')
  private defaultTemplate: TemplateRef<any>;

  initing = false;

  fields = new Array<FormElement>();
  fieldsMap = new Map<string, number>();

  types=FormElementType;

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
          this.value[changeKey] = change[changeKey];
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
    this.applyUpdatesToArrayAsync (this.fields, this.fieldsMap, change, null, (key,item) => {
      return this.loadSubComponent(change.pointer, change.value).then(component => {
        let type: FormElementType;
        switch (item.type) {
          case 'string':
            type = FormElementType.INPUT;
            break;
          case 'number':
            type = FormElementType.NUMERIC;
            break;
          case 'boolean':
            type = FormElementType.CHECK;
            break;
          default:
            type = FormElementType.INPUT;
        }
        component.setName(item.name);
        return new FormElement(item.name, type, component);
      });
    }).then (updatedFields => {
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
    let ref= field.component.providesTemplates(field.type).forFullEdit;
    if( !ref)
      ref = this.defaultTemplate;

    return ref;
  }
}

class FormElement {
  type: FormElementType;
  name: string;
  component: DynamicComponent;

  constructor(name:string,type:FormElementType, component:DynamicComponent) {
    this.name=name;
    this.type=type;
    this.component = component;
  }

}

enum FormElementType {
  INPUT='INPUT', TEXTAREA='TEXTAREA', 'CHECK'='CHECK', NUMERIC='NUMERIC'
}
