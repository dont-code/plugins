import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {Action,
  ActionHandler,
  Change,
  CommandProviderInterface,
  DontCodeModelManager,
  DontCodeModelPointer,
  PreviewHandler,
  dtcde,
} from '@dontcode/core';
import {
  ComponentLoaderService,
  DynamicComponent,
  EntityListManager,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList,
} from '@dontcode/plugin-common';
import { SortEvent } from 'primeng/api';

/**
 * Displays a read-only list of entity in a table.
 * Each field of the entity is a column and managed by one component only (we call setValue for each row we display)
 */
@Component({
  selector: 'dontcode-list-entity',
  templateUrl: './list-entity.component.html',
  styleUrls: ['./list-entity.component.scss'],
})
export class ListEntityComponent
  extends PluginBaseComponent
  implements PreviewHandler, ActionHandler {
  @Input()
  selectedItem: any;

  @Output()
  selectedItemChange = new EventEmitter<any>();

  cols = new Array<PrimeColumn>();
  colsMap = new Map<string, number>();

  @Input()
  store: EntityListManager<any> | null = null;

  constructor(
    ref: ChangeDetectorRef,
    injector: Injector,
    @Inject(ComponentLoaderService) componentLoader: ComponentLoaderService,
    protected modelMgr: DontCodeModelManager
  ) {
    super(componentLoader, injector, ref);
    if( this.modelMgr==null) this.modelMgr=dtcde.getModelManager(); // In case the injext did not work
  }

  selectionChange(event: any): void {
    this.selectedItemChange.emit(event);
  }

  override initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ): any {
    super.initCommandFlow(provider, pointer);

    if (!this.entityPointer)
      throw new Error(
        'Cannot listen to changes without knowing a base position'
      );
    this.decomposeJsonToMultipleChanges(
      this.entityPointer,
      provider.getJsonAt(this.entityPointer.position)
    ); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening(true); // Listen to all changes occuring after entityPointer
  }

  /**
   * Make the appropriate display updates whenever a change is received
   * @param change
   */
  override handleChange(change: Change) {
    //console.log("Changed Entity",change.position);

    if (change.position !== this.entityPointer?.position) {
      // Columns have been changed
      this.applyUpdatesToArrayAsync(
        this.cols,
        this.colsMap,
        change,
        null,
        (position, value) => {
          return this.loadSubComponent(position, value.type, value.name, this.provider?.getJsonAt(position.position)).then((component) => {
            const ret = new PrimeColumn(value.name, value.name, value.type);
            if (component) {
              // Keep the component only if it provides the view template
              if (component.canProvide(value.type).forInlineView) {
                ret.component = component;
                this.applyComponentToSubField(component, value.type, value.name);
              }
            }
            return ret;
          });
        }
      ).then((updatedColumns) => {

        this.cols = updatedColumns;
        //  this.reloadData ();
        this.ref.markForCheck();
        this.ref.detectChanges();
      });
    }
  }

  /**
   * Runs the action on the subcomponents
   * @param action
   */
  async performAction(action: Action): Promise<void> {
    if (action.pointer==null)
      return Promise.reject("No pointer for Action with position "+action.position);
      // It must point directly to the element
    if (action.position == this.entityPointer?.position) {
        // Update all columns
      if (this.store?.entities!=null) {
        for (const colInfo of this.cols)
          if ((colInfo.component as unknown as ActionHandler)?.performAction != null) {
            for (const entity of this.store?.entities) {
              colInfo.component?.setValue(entity[colInfo.field]);
              await (colInfo.component as unknown as ActionHandler).performAction (action);
              }
            }
        }
    }
  }

  retrieveColumnInfo (colName:string): PrimeColumn {
    const index=this.colsMap.get(colName);
    if( index!=null) {
      return this.cols[index];
    }else {
      throw new Error ("Cannot find column with name "+colName);
    }
  }
  providesTemplates(): TemplateList {
    return new TemplateList(null, null, null);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false, false);
  }

  templateOf(col: PrimeColumn, value: any): TemplateRef<any> {
    if (col.component!=null) {
      col.component.setValue(value);
      const ref = col.component.providesTemplates(col.type).forInlineView;
      if (ref) return ref;
    }
    throw new Error('No component or template to display ' + col.type);
  }

  getStoreEntities(): any[] {
    if (this.store?.entities) return this.store.entities;
    else return [];
  }

  dataIsLoaded():void {
    // Try to reduce the number of columns if some of them don't have values

      let data = this.getStoreEntities();
      if( data?.length > 0) {
        const toRemove = new Array<string>();
        toRemove.push(...this.cols.map(value => value.field));
        let row=0;
        while((toRemove.length>0) && (row<data.length)) {
          for (let i=0;i<toRemove.length;i++) {
            const fieldName = toRemove[i];
            if (data[row][fieldName]!=null) {
              toRemove.splice(i, 1);
              i--;
            }
          }
          row++;
        }
        // Let's remove some columns
        if ((toRemove.length>0) && (toRemove.length<this.cols.length)) {
          for (let colPos=0; colPos < this.cols.length;colPos++) {
            let colName = this.cols[colPos].field;
            if (toRemove.indexOf(colName) >=0) {
              this.cols.splice(colPos, 1);
              for (let entry of this.colsMap.entries()) {
                if (entry[1]===colPos) {
                  this.colsMap.delete(entry[0]);
                  break;
                }
              }
            }
          }
        }
      }

    }

  customSort(event: SortEvent) {
    if ((event.field!=null) && (event.data!=null)) {
      this.modelMgr.sortValues (event.data, event.order, event.field);
    }
  }
}

class PrimeColumn {
  field: string;
  header: string;
  type: string;
  component: DynamicComponent | null;

  constructor(field: string, header: string, type: string) {
    this.field = field;
    this.header = header;
    this.type = type;
    this.component = null;
  }
}
