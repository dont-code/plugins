import {ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {
  ComponentLoaderService,
  DynamicComponent,
  EntityListManager,
  PluginBaseComponent,
  TemplateList
} from "@dontcode/plugin-common";


@Component({
  selector: 'dontcode-list-entity',
  templateUrl: './list-entity.component.html',
  styleUrls: ['./list-entity.component.scss']
})
export class ListEntityComponent extends PluginBaseComponent implements PreviewHandler, OnInit {

  @Input()
  selectedItem: any;

  @Output()
  selectedItemChange = new EventEmitter<any>();

  itemKeyName: string;
  initing = false;

  cols = new Array<PrimeColumn>();
  colsMap = new Map<string, number>();


  @Input()
  store: EntityListManager;

  constructor(private ref:ChangeDetectorRef, componentLoader: ComponentLoaderService, injector: Injector) {
    super(componentLoader, injector);
  }

  ngOnInit(): void {
  }

  selectionChange (event): void {
    this.selectedItemChange.emit(event);
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    this.initing=true;
    super.initCommandFlow(provider, pointer);

    this.decomposeJsonToMultipleChanges (this.entityPointer, provider.getJsonAt(this.entityPointer.position)); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening (); // Listen to all changes occuring after entityPointer
    this.initing=false;
//    this.reloadData();
  }

  /**
   * Make the appropriate display updates whenever a change is received
   * @param change
   * @protected
   */
  protected handleChange (change: Change ) {
    //console.log("Changed Entity",change.position);

    this.applyUpdatesToArrayAsync (this.cols, this.colsMap, change, null, (key,item) => {
      return this.loadSubComponent(change.pointer, change.value).then(component => {

        const ret= new PrimeColumn(item.name, item.name, change.pointer);
        if( component ) {
          // Keep the component only if it provides the view template
          if (component.providesTemplates().forInlineView) {
            ret.component=component;
          }
        }
        return ret;
      });
    }).then(updatedColumns => {
      this.cols = updatedColumns;
      //  this.reloadData ();
      this.ref.markForCheck();
      this.ref.detectChanges();
    });
  }

  providesTemplates(): TemplateList {
    return null;
  }

  templateOf (col: PrimeColumn, value:any): TemplateRef<any> {
    col.component.setValue(value);
    return col.component.providesTemplates().forInlineView;
  }

}

class PrimeColumn {
  field:string; header:string;
  pointer:DontCodeModelPointer;
  component: DynamicComponent;

  constructor(field: string, header: string, pointer: any) {
    this.field = field;
    this.header = header;
  }

}


