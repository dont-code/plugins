import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import { Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { PluginBaseComponent } from "@dontcode/plugin-common";
import {ListEntityComponent} from "./list-entity.component";
import {EditEntityComponent} from "./edit-entity.component";


@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends PluginBaseComponent implements PreviewHandler, AfterViewInit {

  entityName:string;
  selectedItem: any;

  tabIndex = 0;

  @ViewChild(ListEntityComponent)
  list: ListEntityComponent;

  @ViewChild(EditEntityComponent)
  edit: EditEntityComponent;

  constructor(private ref:ChangeDetectorRef) {
    super();
  }


  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    super.initCommandFlow(provider, pointer);
    this.decomposeJsonToMultipleChanges (this.entityPointer, provider.getJsonAt(this.entityPointer.position));
    this.initChangeListening (); // Listen to name changes of this Entity
  }

  ngAfterViewInit(): void {
    // When testing entityPointer is not defined
    if (this.entityPointer) {
      this.list.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
      this.edit.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
    }
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
    if ($event) {
      this.tabIndex = 1;  // Automatically move to edit when selection is made
    }
  }
}



