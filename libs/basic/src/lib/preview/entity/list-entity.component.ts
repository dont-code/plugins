import {Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {PluginBaseComponent} from "@dontcode/plugin-common";


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
  values = new Array<any>();

  constructor(private ref:ChangeDetectorRef) {
    super();
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
    this.reloadData();
  }

  /**
   * Make the appropriate display updates whenever a change is received
   * @param change
   * @protected
   */
  protected handleChange (change: Change ) {
    //console.log("Changed Entity",change.position);

    this.cols = this.applyUpdatesToArray (this.cols, this.colsMap, change, null, (key,item) => {
      return new PrimeColumn(item.name, item.name);
    });
    this.reloadData ();
    this.ref.markForCheck();
    this.ref.detectChanges();

  }

  protected reloadData () {
    if (!this.initing) {
      this.values.length=0;
      const fields = this.provider.getJsonAt(this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE).position)
      if (fields) {
        let first=true;
        for (let i=0; i<10;i++) {
          const row = {};
          for (const field of Object.values(fields) as any) {
            if (first) {
              this.itemKeyName = field.name;
              first = false;
            }
            switch (field.type) {
              case 'string':
                row[field.name] = field.name+' '+i;
                break;
              case 'boolean':
                row[field.name] = (i % 3 === 0);
                break;
              case 'number':
                row[field.name] = i;
                break;
              default:
                row[field.name] = field.name+' '+i;
            }
          }
          this.values.push(row);
        }
      }
      //trigger change detection
      this.values = [...this.values];
    }
  }



}

class PrimeColumn {
  field:string; header:string;

  constructor(field: string, header: string) {
    this.field = field;
    this.header = header;
  }
}


