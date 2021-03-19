import {ChangeDetectorRef, Component, ComponentFactoryResolver, Injector, Input, OnInit} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {PluginBaseComponent, TemplateList} from "@dontcode/plugin-common";
import {ComponentLoaderService} from "../../../../../common/src/lib/common-dynamic/component-loader.service";

@Component({
  selector: 'dontcode-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent extends PluginBaseComponent implements PreviewHandler, OnInit {

  @Input()
  value:any

  initing = false;

  fields = new Array<FormElement>();
  fieldsMap = new Map<string, number>();

  types=FormElementType;

  constructor(private ref:ChangeDetectorRef, componentLoader: ComponentLoaderService, injector: Injector) {
    super(componentLoader, injector);
  }

  ngOnInit(): void {
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
    this.applyUpdatesToArray (this.fields, this.fieldsMap, change, null, (key,item) => {
      let type:FormElementType;
      switch (item.type) {
        case 'string':
          type=FormElementType.INPUT;
          break;
        case 'number':
          type=FormElementType.NUMERIC;
          break;
        case 'boolean':
          type=FormElementType.CHECK;
          break;
        default:
          type = FormElementType.INPUT;
      }
      return new FormElement(item.name, type);
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

  }

  providesTemplates(): TemplateList {
    return null;
  }

}

class FormElement {
  type: FormElementType;
  name: string;

  constructor(name?:string,type?:FormElementType) {
    this.name=name;
    this.type=type;
  }

}

enum FormElementType {
  INPUT='INPUT', TEXTAREA='TEXTAREA', 'CHECK'='CHECK', NUMERIC='NUMERIC'
}
