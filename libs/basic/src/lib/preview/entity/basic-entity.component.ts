import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { map } from "rxjs/operators";
import { PluginBaseComponent } from "../../../../../common/src/lib/common-ui/plugin-base.component";

@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends PluginBaseComponent implements PreviewHandler {

  entityName:string;
  cols:PrimeColumn[];
  values:any[];

  constructor(private ref:ChangeDetectorRef) {
    super();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    super.initCommandFlow(provider, pointer);

    const curJson = provider.getJsonAt(this.entityPointer.position);
    console.log("Entity init:",curJson);
    if (curJson) {
      this.entityName=curJson[DontCodeModel.APP_ENTITIES_NAME_NODE];
      this.cols = this.updateColumns (this.cols, curJson[DontCodeModel.APP_FIELDS_NODE]);
      this.ref.markForCheck();
      this.ref.detectChanges();
    }

    //console.log("Listening to ",pointer.position);
    this.subscriptions.add (provider.receiveCommands(this.entityPointer.position).pipe(
      map (change => {
        //console.log("Changed Entity",change.position);
        let prop = change.pointer.isPropertyOf(this.entityPointer);
        if( prop ) {
          switch (prop) {
            case     DontCodeModel.APP_ENTITIES_NAME_NODE:
              this.entityName = change.value;
              break;
            case     DontCodeModel.APP_FIELDS_NODE:
              this.cols = this.updateColumns (this.cols,
                provider.getJsonAt(this.entityPointer.position+'/'+DontCodeModel.APP_FIELDS_NODE)
              );
              break;
          }
        }/* else {
          let value = this.decodeMapField(change, this.fields, DontCodeModel.APP_FIELDS_NODE);
          if( value) {
            this.fields=value;
            this.cols = this.updateColumns (this.cols, this.fields);
          }}*/
        //console.log("Entity Name updated:", this.entityName);
        this.ref.markForCheck();
        this.ref.detectChanges();
      }))
      .subscribe()
    );
  }

  private updateColumns(cols: PrimeColumn[], fields: any) : PrimeColumn[]{
    let ret=new Array<PrimeColumn>();
    for (const field in fields){
      ret.push (new PrimeColumn(field, fields[field].name));
    };
    return ret;
  }

}

class PrimeColumn {
  field:string; header:string;

  constructor(field: string, header: string) {
    this.field = field;
    this.header = header;
  }
}

