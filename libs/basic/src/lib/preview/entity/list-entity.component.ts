import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {
  ComponentLoaderService,
  DynamicComponent,
  EntityListManager,
  PluginBaseComponent,
  PossibleTemplateList,
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

  initing = false;

  cols = new Array<PrimeColumn>();
  colsMap = new Map<string, number>();


  @Input()
  store: EntityListManager|null = null;

  constructor(private ref:ChangeDetectorRef, injector:Injector, @Inject(ComponentLoaderService) componentLoader: ComponentLoaderService) {
    super(componentLoader, injector);
  }

  ngOnInit(): void {
  }

  selectionChange (event:any): void {
    this.selectedItemChange.emit(event);
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    this.initing=true;
    try {
    super.initCommandFlow(provider, pointer);

    if (!this.entityPointer)  throw new Error ('Cannot listen to changes without knowing a base position');
    this.decomposeJsonToMultipleChanges (this.entityPointer, provider.getJsonAt(this.entityPointer.position)); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening (); // Listen to all changes occuring after entityPointer
    } finally {
      this.initing=false;
    }
//    this.reloadData();
  }

  /**
   * Make the appropriate display updates whenever a change is received
   * @param change
   * @protected
   */
  protected handleChange (change: Change ) {
    //console.log("Changed Entity",change.position);

    this.applyUpdatesToArrayAsync (this.cols, this.colsMap, change, null, (position,value) => {
      return this.loadSubComponent(position, value).then(component => {

        const ret= new PrimeColumn(value.name, value.name, value.type);
        if( component ) {
          // Keep the component only if it provides the view template
          if (component.canProvide(value.type).forInlineView) {
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
    return new TemplateList(null,null,null);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false, false);
  }

  templateOf (col: PrimeColumn, value:any): TemplateRef<any> {
    if( col.component) {
      col.component.setValue(value);
      const ref= col.component.providesTemplates(col.type).forInlineView;
      if( ref)
        return ref;
    }
    throw new Error ('No component or template to display '+col.type);
  }

  getStoreEntities(): any[] {
    if( this.store)
      return this.store.entities;
    else
      return [];
  }
}

class PrimeColumn {
  field:string; header:string; type:string;
  component: DynamicComponent|null;

  constructor(field: string, header: string, type:string) {
    this.field = field;
    this.header = header;
    this.type = type;
    this.component=null;
  }

}


