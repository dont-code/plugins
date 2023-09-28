import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewChild} from "@angular/core";
import {
  Action,
  ActionContextType,
  ActionType,
  Change,
  CommandProviderInterface,
  DontCodeModel,
  DontCodeModelPointer,
  PreviewHandler
} from "@dontcode/core";
import {
  ComponentLoaderService,
  EntityListManager,
  EntityStoreService,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList
} from "@dontcode/plugin-common";
import {map} from "rxjs/operators";
import {ListEntityComponent} from "./list-entity.component";
import {EditEntityComponent} from "./edit-entity.component";


@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicEntityComponent extends PluginBaseComponent implements PreviewHandler, AfterViewInit {

  entityName:string='';
  selectedItem: any;
  canSave = false;

  store:EntityListManager<any>|null=null;

  tabIndex = 0;

  dataLoading = false;

  @ViewChild(ListEntityComponent)
  list!: ListEntityComponent;

  @ViewChild(EditEntityComponent)
  edit!: EditEntityComponent;

  static readonly baseRefreshIcons='pi pi-refresh';
  refreshIcon = BasicEntityComponent.baseRefreshIcons;

  constructor(protected entityService:EntityStoreService, ref:ChangeDetectorRef, componentLoader: ComponentLoaderService, injector:Injector) {
    super(componentLoader, injector, ref);
  }


  override initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    super.initCommandFlow(provider, pointer);
    if( this.entityPointer) {
      const json=provider.getJsonAt(this.entityPointer.position);
      this.store = this.entityService.retrieveListManager(this.entityPointer, json);
      this.decomposeJsonToMultipleChanges (this.entityPointer, json);
    }
    this.initChangeListening (); // Listen to name changes of this Entity
  }

  override ngAfterViewInit(): void {
    // When testing entityPointer is not defined
    if ((this.entityPointer)&&(this.provider)) {
      this.list.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
      this.edit.initCommandFlow(this.provider, this.entityPointer.subPropertyPointer(DontCodeModel.APP_FIELDS_NODE));
      if( this.store!=null) {
        //this.dataLoading=true;
        this.store.loadAll().then (() => {
          console.debug ("Loaded entities");
          try {
            this.list.dataIsLoaded();
          } catch (e) {
            console.debug("Just ignore errors when calling dataIsloaded")
          }
          //this.dataLoading=false;
          this.ref.markForCheck();
          this.ref.detectChanges();
        }, reason => {
          //this.dataLoading=false;
          this.ref.markForCheck();
          this.ref.detectChanges();
        });
      }
    } else {
      throw new Error ('Cannot create subcomponents before initCommandFlow is called');
    }
    super.ngAfterViewInit();
  }

  protected override initChangeListening() {
    super.initChangeListening();
    if( this.provider) {
      this.subscriptions.add(this.provider.receiveCommands(DontCodeModel.APP_SHARING_WITH).pipe(
        map(change => {
          if (this.store) {
          console.debug("Reloading data due to change of StoreManager");
//          this.dataLoading=true;
          this.store.reset();
          this.store.loadAll().then (() => {
            try {
                this.list.dataIsLoaded();
              } catch (e) {
                  console.debug("Just ignore errors when calling dataIsloaded")
              }
            //this.dataLoading=false;
            this.ref.markForCheck();
            this.ref.detectChanges();
          }, reason => {
            //           this.dataLoading=false;
            this.ref.markForCheck();
            this.ref.detectChanges();
          })
        } else {
          console.error ('Cannot reload data because store is not set');
          }
        })).subscribe()
      );
    } else {
      throw new Error('Cannot create subcomponents before initCommandFlow is called');
    }
  }

  /**
   * Make the appropriate display updates whenever a change is received
   * @param change
   * @protected
   */
  override handleChange (change: Change ) {
    //console.log("Changed Entity",change.position);
    if( !change.pointer) {
      if(this.provider) {
        change.pointer=this.provider.calculatePointerFor(change.position);
      }else {
        throw new Error ('Cannot handle change with no pointer for position'+ change.position);
      }
    }
    if( this.entityPointer) {
      const prop = change.pointer.isUnderSubItemOf(this.entityPointer);
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
    } else {
      throw new Error ('Need an entityPointer to handle change @'+change.position);
    }
  }

  async selectChange($event: any) {
//    console.log("Event:", $event);
    if ($event) {
      // Load the details of the selected element
      if( this.store!=null) {
        await this.store.loadDetailOf ($event).then(newValue => {
          if( newValue!=null) {
            this.selectedItem=newValue;
          }
        }).catch(reason => {
          console.error("Ignoring the failed loading of "+$event._id+" due to ", reason);
        })
      }
      this.canSave=true;
      this.tabIndex = 1;  // Automatically move to edit when selection is made
    } else {
      this.canSave=false;
    }
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  async deleteEntity() {
    if( (this.selectedItem) && (this.store)) {
      await this.store.remove(this.selectedItem).then(deleted => {
        this.selectedItem = null;
        this.canSave=false;
        this.tabIndex=0;
        this.ref.markForCheck();
        this.ref.detectChanges();
      })
    }
  }

  newEntity() {
    const newEntity = {};
    this.store?.push(newEntity);
    this.selectedItem = newEntity;
    this.canSave=true;
    this.tabIndex = 1;
  }

  async saveEntity() {

    if( this.selectedItem) {
      this.canSave=false;
      try {
          // Ensure all fields are ok
        //this.edit.form.updateValueAndValidity({onlySelf:true, emitEvent:false});
        this.edit.getValue();
        await this.store?.store (this.selectedItem).then(value => {
          console.debug("Entity named ", this.entityName+" with value "+value, " stored at position "+this.entityPointer?.position);
          this.selectedItem = value;
          this.tabIndex=0;
        }).catch(reason => {
          console.error("Entity named ", this.entityName, " not saved because of ",reason);
        });
      } finally {
        this.canSave=true;
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    }
  }

  providesTemplates(): TemplateList {
    return new TemplateList(null,null,null);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false,false,false);
  }

  async refreshScreen():Promise<void> {
    console.debug("Refresh called");
    if (this.entityPointer!=null) {
      if (this.tabIndex==0) { // List
        try {
          this.refreshIcon=BasicEntityComponent.baseRefreshIcons+' pi-spin';
          console.debug("Performing action");
          await this.pluginHelper.performAction (
            new Action (this.entityPointer?.position,null, ActionContextType.LIST, ActionType.EXTRACT, this.entityPointer)
          );

          console.debug("Marking for Check");
          this.ref.markForCheck();
          this.ref.detectChanges();

          console.debug("Storing Changed values");
          await this.store?.storeAllChanged ();
          console.debug("Stored values changed");
        } catch(reason) {
          console.error ("Error ",reason," performing refresh action on ",this.entityName, this.entityPointer);
        } finally {
          this.refreshIcon=BasicEntityComponent.baseRefreshIcons;
          this.ref.markForCheck();
          this.ref.detectChanges();
        }
      } else return Promise.reject('Not displaying the list');
    } else return Promise.reject('No entityPointer');
  }

}
