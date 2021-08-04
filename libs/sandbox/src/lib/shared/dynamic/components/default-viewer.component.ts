import {Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer} from "@dontcode/core";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, TemplateRef} from "@angular/core";
import {
  ComponentLoaderService,
  DynamicComponent,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList
} from "@dontcode/plugin-common";

@Component({
  selector: 'dontcode-sandbox-default-viewer',
  templateUrl: './default-viewer.component.html',
  styleUrls: ['./default-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultViewerComponent extends PluginBaseComponent {

  fields = new Array<Field>();
  fieldsMap = new Map<string, number>();

  entityName = 'Unknown';

  constructor(loader: ComponentLoaderService, injector:Injector, protected ref:ChangeDetectorRef) {
    super(loader, injector);
  }

  initCommandFlow(provider: CommandProviderInterface, pointer:DontCodeModelPointer) {
    super.initCommandFlow(provider, pointer);
    if (this.isEntity()) {
      this.decomposeJsonToMultipleChanges(pointer, provider.getJsonAt(pointer.position));
      this.initChangeListening();
    }
    this.ref.detectChanges();
  }


  protected handleChange(change: Change) {
    super.handleChange(change);
    if (this.entityPointer) {
    if (change?.pointer?.schemaPosition===DontCodeModel.APP_FIELDS) {
      this.applyUpdatesToArrayAsync (this.fields, this.fieldsMap, change, null, (position, value) => {
        return this.loadSubComponent(position, value).then(component => {

          const ret= new Field(value.name, value.type);
          if( component ) {
            // Keep the component only if it provides the view template
            if (component.canProvide(value.type).forInlineView) {
              ret.component=component;
            }
          }
          return ret;
        });
      }).then(updatedColumns => {
        this.fields = updatedColumns;
        //  this.reloadData ();
        this.ref.markForCheck();
        this.ref.detectChanges();
      });
    } else if (change?.pointer?.isPropertyOf(this.entityPointer)==='name') {
        // The name of the entity is being changed, let's update it
      this.entityName = change.value;
      this.ref.markForCheck();
      this.ref.detectChanges();
      }
    }

  }

  templateOf (col: Field, value:any): TemplateRef<any> {
    if( col.component) {
      col.component.setValue(value);
      const ref= col.component.providesTemplates(col.type).forInlineView;
      if( ref)
        return ref;
    }
    throw new Error ('No component or template to display '+col.type);
  }

  canProvide(key?: string): PossibleTemplateList {
    throw new Error('Unsupported');
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error('Unsupported');
  }

  isEntity (): boolean {
    if (DontCodeModel.APP_ENTITIES === this.entityPointer?.schemaPosition)
      return true;
    return false;
  }

}

class Field {
  name:string;
  type:string;
  component: DynamicComponent|null;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
    this.component=null;
  }

}
