import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewChild} from "@angular/core";
import {Change, CommandProviderInterface, DontCodeModel, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {
  ComponentLoaderService,
  EntityListManager,
  EntityStoreService,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList
} from "@dontcode/plugin-common";
import {ListEntityComponent} from "./list-entity.component";
import {EditEntityComponent} from "./edit-entity.component";
import {map} from "rxjs/operators";


@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends PluginBaseComponent implements PreviewHandler, AfterViewInit {

  entityName:string;
  selectedItem: any;

  store:EntityListManager;

  tabIndex = 0;

  @ViewChild(ListEntityComponent)
  list: ListEntityComponent;

  @ViewChild(EditEntityComponent)
  edit: EditEntityComponent;

  constructor(protected entityService:EntityStoreService, private ref:ChangeDetectorRef, componentLoader: ComponentLoaderService) {
    super(componentLoader);
  }


  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    super.initCommandFlow(provider, pointer);
    if( this.entityPointer) {
      const json=provider.getJsonAt(this.entityPointer.position);
      this.store = this.entityService.retrieveListManager(this.entityPointer.position, json);
      this.decomposeJsonToMultipleChanges (this.entityPointer, json);
    }
    this.initChangeListening (); // Listen to name changes of this Entity
  }

  ngAfterViewInit(): void {
    // When testing entityPointer is not defined
    if (this.entityPointer) {
      this.list.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
      this.edit.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
      this.store.loadAll().then (() => {
        console.log ("Loaded entities");
        this.ref.markForCheck();
        this.ref.detectChanges();
      });
    }
  }

  protected initChangeListening() {
    super.initChangeListening();
    this.subscriptions.add(this.provider.receiveCommands(DontCodeModel.APP_SHARING_WITH).pipe(
      map(change => {
        console.log("Reloading data due to change of StoreManager");
        this.store.reset();
        this.store.loadAll().then (() => {
          this.ref.markForCheck();
          this.ref.detectChanges();
        })
      }))
      .subscribe()
    );

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
    // console.log("Event:", $event);
    if ($event) {
      this.tabIndex = 1;  // Automatically move to edit when selection is made
    }
  }

  deleteEntity() {
    if( this.selectedItem) {
      this.store.remove(this.selectedItem).then(deleted => {
        this.selectedItem = null;
        this.tabIndex=0;
        this.ref.markForCheck();
        this.ref.detectChanges();
      })
    }
  }

  newEntity() {
    const newEntity = {};
    this.store.push(newEntity);
    this.selectedItem = newEntity;
    this.tabIndex = 1;
  }

  saveEntity() {
    if( this.selectedItem) {
      this.store.store (this.selectedItem).then(value => {
        console.log("Entity with Id ", value, " stored");
        this.selectedItem = value;
      });
    }
  }

  providesTemplates(): TemplateList {
    return null;
  }

  canProvide(key?: string): PossibleTemplateList {
    return null;
  }
}



