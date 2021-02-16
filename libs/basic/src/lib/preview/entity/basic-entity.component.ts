import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import { Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { PluginBaseComponent } from "@dontcode/plugin-common";
import {ListEntityComponent} from "./list-entity.component";


@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends PluginBaseComponent implements PreviewHandler, AfterViewInit {

  entityName:string;
  selectedItem: any;

  @ViewChild(ListEntityComponent)
  list: ListEntityComponent;

  constructor(private ref:ChangeDetectorRef) {
    super();
  }


  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    super.initCommandFlow(provider, pointer);
    this.decomposeJsonToMultipleChanges (this.entityPointer, provider.getJsonAt(this.entityPointer.position));
    this.initChangeListening (); // Listen to name changes of this Entity
  }

  ngAfterViewInit(): void {
    this.list.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
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
        default:
          return;
      }
    }
    this.ref.markForCheck();
    this.ref.detectChanges();

  }

  selectChange($event: any) {
    console.log("Event:", $event);
  }
}



