import {
  Change,
  CommandProviderInterface,
  DontCodeModel,
  DontCodeModelPointer, DontCodeStoreManager,
  DontCodeStoreProvider,
  dtcde,
} from '@dontcode/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {
  ComponentLoaderService,
  DynamicComponent,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList,
} from '@dontcode/plugin-common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'dontcode-sandbox-default-viewer',
  templateUrl: './default-viewer.component.html',
  styleUrls: ['./default-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultViewerComponent extends PluginBaseComponent {
  fields = new Array<Field>();
  fieldsMap = new Map<string, number>();

  entityName = 'Unknown';

  store?: DontCodeStoreProvider;

  constructor(
    loader: ComponentLoaderService,
    injector: Injector,
    protected ref: ChangeDetectorRef,
    protected fb: FormBuilder,
    protected storeMgr:DontCodeStoreManager
  ) {
    super(loader, injector);
    // Hack for when DI doesn't find the storemanager due to mfe stuff
    if (this.storeMgr==null) {
      this.storeMgr = dtcde.getStoreManager();
      console.warn("DontCodeStoreManager not found by Angular's Injector");
    }

    this.setForm(this.fb.group({}, { updateOn: 'blur' }));
  }

  override initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ) {
    super.initCommandFlow(provider, pointer);
    if (this.isEntity()) {
      this.decomposeJsonToMultipleChanges(
        pointer,
        provider.getJsonAt(pointer.position)
      );
      this.store = this.storeMgr.getProvider(pointer.position);
      if (this.store != null) {
        this.store.loadEntity(pointer.position, null).then(
          (val) => {
            this.setValue(val);
            this.rebuildForm();
            this.ref.detectChanges();
          },
          (error)=> {
            console.error("Cannot load element with DefaultViewer because of error ", error);
          });
      }
      this.initChangeListening();
      this.rebuildForm();
    }
    this.ref.detectChanges();
  }

  override handleChange(change: Change) {
    super.handleChange(change);

    if (this.entityPointer) {
      if (change?.pointer?.positionInSchema === DontCodeModel.APP_FIELDS) {
        this.applyUpdatesToArrayAsync(
          this.fields,
          this.fieldsMap,
          change,
          'fields',
          (position, value) => {
            return this.loadSubField(value.type, value.name, null).then(
              (component) => {
                const ret = new Field(value.name, value.type);
                if (component) {
                  // Keep the component only if it provides the view template
                  if (component.canProvide(value.type).forInlineView) {
                    ret.component = component;
                  }
                }
                return ret;
              }
            );
          }
        ).then((updatedColumns) => {
          this.fields = updatedColumns;
          this.rebuildForm();
          //  this.reloadData ();
          this.ref.markForCheck();
          this.ref.detectChanges();
        });
      } else if (change?.pointer?.isSubItemOf(this.entityPointer) === 'name') {
        // The name of the entity is being changed, let's update it
        this.entityName = change.value;
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    }
  }

  templateOf(col: Field, value: any): TemplateRef<any> {
    if (col.component) {
      col.component.setValue(value);
      const ref = col.component.providesTemplates(col.type).forInlineView;
      if (ref) return ref;
    }
    throw new Error('No component or template to display ' + col.type);
  }

  editTemplateOf(col: Field, value: any): TemplateRef<any> {
    if (col.component) {
      col.component.setValue(value);
      const ref = col.component.providesTemplates(col.type).forFullEdit;
      if (ref) return ref;
    }
    throw new Error('No component or template to display ' + col.type);
  }

  canProvide(key?: string): PossibleTemplateList {
    throw new Error('Unsupported');
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error('Unsupported');
  }

  isEntity(): boolean {
    if (DontCodeModel.APP_ENTITIES === this.entityPointer?.positionInSchema)
      return true;
    return false;
  }

  /**
   * Rebuild the Reactive form from the list of fields configured with the entity
   * @private
   */
  private rebuildForm() {
    if (this.form) {
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
        if (field.component) field.component.setValue(val);

        // Check if the component manages the FormControl itself or if it relies on us
        if (!field.component?.managesFormControl())
          this.form.setControl(
            field.name,
            new FormControl(val, Validators.required)
          );
      });

      toRemove.forEach((key) => {
        this.form.removeControl(key);
      });
    }
  }

  getData(fieldName: string): any | undefined {
    if (this.form.controls[fieldName])
      return this.form.controls[fieldName].value;
    else return undefined;
  }
}

class Field {
  name: string;
  type: string;
  component: DynamicComponent | null;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
    this.component = null;
  }
}
