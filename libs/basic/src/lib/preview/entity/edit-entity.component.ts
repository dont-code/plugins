import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer} from "@dontcode/core";
import {
  ComponentLoaderService,
  DynamicComponent,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList
} from "@dontcode/plugin-common";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dontcode-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent extends PluginBaseComponent implements OnInit {

  @Input("value") set _value(newval:any) {
    this.value = newval;

    if( this.value) {
        // Transforms the stored values into field values
      this.fields.forEach(field => {
        if (field?.component?.managesFormControl()) {
          field.component.setValue(this.value[field.name]);
        } else {
          if (this.form) {
            const singleVal:{[key:string]:any}={};
            singleVal[field.name]=this.value[field.name];
            this.form.patchValue(singleVal,{emitEvent:false});
           }
        }
      });
    } else {
      this.form?.reset({}, {emitEvent:false});
    }
  }

  @ViewChild('defaulteditor')
  private defaultTemplate!: TemplateRef<any>;

  initing = false;

  fields = new Array<FormElement>();
  fieldsMap = new Map<string, number>();

  formConfig = {};

  constructor(private ref:ChangeDetectorRef, protected fb:FormBuilder, componentLoader: ComponentLoaderService) {
    super(componentLoader);
  }

  ngOnInit(): void {
    this.form = this.fb.group({}, {updateOn:'blur'});
    this.form.valueChanges.subscribe(change => {
      if (this.value) {
        for (const changeKey in change) {
          if( change.hasOwnProperty(changeKey)) {
            const field = this.fields.find(toSearch => {
              if (toSearch.name===changeKey)
                return true;
              else
                return false;
            });
            let newVal = change[changeKey];
            if (field?.component?.managesFormControl()) {
              newVal = field.component.getValue();
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

    if (!this.entityPointer)  throw new Error ('Cannot listen to changes without knowing a base position');
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
        if( component) {
          component.setName(value.name);
          component.setForm(this.form);
        }
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
      if( field.component)
        field.component.setValue(val);

      // Check if the component manages the FormControl itself or if it relies on us
      if(!field.component?.managesFormControl())
        this.form.registerControl(field.name, new FormControl(val, Validators.required));

    });

    toRemove.forEach(key => {
      this.form.removeControl(key);
    })

  }

  providesTemplates(): TemplateList {
    return new TemplateList(null,null,null);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false, false);
  }

  templateOf(field: FormElement): TemplateRef<any> {
    let ref= field.component?.providesTemplates(field.type).forFullEdit;
    if( !ref)
      ref = this.defaultTemplate;

    return ref;
  }

  setForm(form: FormGroup) {
    // Just ignore any form set
    if (form) {
      throw new Error ("Trying to set a form to the Edit Entity component who already has one");
    }
  }
}

class FormElement {
  type: string;
  name: string;
  component: DynamicComponent|null;

  constructor(name:string,type:string, component:DynamicComponent|null) {
    this.name=name;
    this.type=type;
    this.component = component;
  }

}
