import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { map, takeUntil } from "rxjs/operators";
import { BasicComponent } from "../basic-component";
import { combineLatest, Observable } from "rxjs";

@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends BasicComponent implements PreviewHandler {
  protected change$:Observable<Change>

  entityName:string;
  fields:any[];

  constructor(protected ref:ChangeDetectorRef) {
    super();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    const curJson = provider.getJsonAt(pointer.position);
    console.log("Entity init:",curJson);
    if (curJson) {
      this.entityName=curJson[DontCodeModel.APP_ENTITIES_NAME_NODE];
      this.fields=curJson[DontCodeModel.APP_FIELDS_NODE];
      this.ref.detectChanges();
    }

    //console.log("Listening to ",pointer.position);
    provider.receiveCommands(pointer.position).pipe(
      takeUntil(this.unsubscriber))
      .subscribe(change => {
        //console.log("Changed Entity",change.position);
        let value:any=this.decodeStringField(change, DontCodeModel.APP_ENTITIES_NAME_NODE);
        if( value ) {
          this.entityName=change.value;
        } else {
          value = this.decodeArrayField(change, DontCodeModel.APP_FIELDS_NODE);
          if( value) {
            this.fields=value;
        }}
        //console.log("Entity Name updated:", this.entityName);
        this.ref.detectChanges();
      });
  }

}
