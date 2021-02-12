import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
/**
 * The next import is modified during the build by the build script. Don't change it
 */
import { PluginBaseComponent } from "@dontcode/plugin-common";


@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends PluginBaseComponent implements PreviewHandler {

  entityName:string;
  cols = new Array<PrimeColumn>();
  colsMap = new Map<string, number>();
  values = new Array<any>();

  constructor(private ref:ChangeDetectorRef) {
    super();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    super.initCommandFlow(provider, pointer);

    this.decomposeJsonToMultipleChanges (this.entityPointer, provider.getJsonAt(this.entityPointer.position)); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening (); // Listen to all changes occuring after entityPointer

  }


  /**
   * Make the appropriate display updates whenever a change is received
   * @param change
   * @protected
   */
  protected handleChange (change: Change ) {
    //console.log("Changed Entity",change.position);
    const prop = change.pointer.getUnderPropertyOf(this.entityPointer);
    if( prop ) {
      switch (prop) {
        case     DontCodeModel.APP_ENTITIES_NAME_NODE:
          this.entityName = change.value;
          break;
        case     DontCodeModel.APP_FIELDS_NODE:
          /*this.cols = this.updateColumns (this.cols,
            provider.getJsonAt(this.entityPointer.position+'/'+DontCodeModel.APP_FIELDS_NODE)
          );*/
          this.cols = this.applyUpdatesToArray (this.cols, this.colsMap, change, prop, (key,item) => {
            return new PrimeColumn(item.name, item.name);
          });
          this.reloadData ();
          break;
      }
    }
    this.ref.markForCheck();
    this.ref.detectChanges();

  }

  protected reloadData () {
    this.values.length=0;
    const fields = this.provider.getJsonAt(this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE).position)
    if (fields) {
      for (let i=0; i<10;i++) {
        const row = {};
        for (const field of Object.values(fields) as any) {
          row[field.name] = field.type+' '+i;
        }
        this.values.push(row);
      }
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

