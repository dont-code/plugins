import {
  Change,
  CommandProviderInterface,
  DontCodeModel,
  DontCodeModelPointer,
  DontCodeStoreManager,
  DontCodeStoreProvider,
  dtcde,
} from '@dontcode/core';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, TemplateRef,} from '@angular/core';
import {
  ComponentLoaderService,
  PluginBaseComponent,
  PossibleTemplateList, SubFieldInfo,
  TemplateList,
} from '@dontcode/plugin-common';
import {FormBuilder,} from '@angular/forms';

@Component({
  selector: 'dontcode-sandbox-default-viewer',
  templateUrl: './default-viewer.component.html',
  styleUrls: ['./default-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultViewerComponent extends PluginBaseComponent {

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

    if (this.entityPointer) {
      if (change?.pointer?.positionInSchema === DontCodeModel.APP_FIELDS) {
        this.updateSubFieldsWithChange(change, 'fields').then((updatedColumns) => {
          if (updatedColumns!=null) {
            //  this.reloadData ();
            this.ref.markForCheck();
            this.ref.detectChanges();
          }
        });
      } else if (change?.pointer?.isSubItemOf(this.entityPointer) === 'name') {
        // The name of the entity is being changed, let's update it
        this.entityName = change.value;
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    }
  }

  templateOf(col: SubFieldInfo, value: any): TemplateRef<any> {
    if (col.component) {
      col.component.setValue(value);
      const ref = col.component.providesTemplates(col.type).forInlineView;
      if (ref) return ref;
    }
    throw new Error('No component or template to display ' + col.type);
  }

  editTemplateOf(col: SubFieldInfo, value: any): TemplateRef<any> {
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

  getData(fieldName: string): any | undefined {
    if (this.form.controls[fieldName])
      return this.form.controls[fieldName].value;
    else return undefined;
  }
}

