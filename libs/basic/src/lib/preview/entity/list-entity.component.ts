import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter, Injector,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {PluginBaseComponent, EntityListManager, TemplateList, DynamicComponent} from "@dontcode/plugin-common";


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

  constructor(private ref:ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver, injector: Injector) {
    super(componentFactoryResolver, injector);
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

        const ret= new PrimeColumn(item.name, item.name);
        if( component ) {
          ret.component=component;
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

  templateOf (col: PrimeColumn): TemplateRef<any> {
    return col.component.providesTemplates().forInlineView;
  }

}

class PrimeColumn {
  field:string; header:string;
  component: DynamicComponent;

  constructor(field: string, header: string) {
    this.field = field;
    this.header = header;
  }

}


