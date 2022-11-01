import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Optional,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import {DontCodeModelManager, DontCodeStoreManager, dtcde} from "@dontcode/core";
import {AbstractDynamicComponent} from "./abstract-dynamic-component";
import {PossibleTemplateList, TemplateList} from "./template-list";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {
  BaseDynamicEvent,
  BaseDynamicEventSource,
  DynamicEvent,
  DynamicEventSource,
  DynamicEventType
} from "./dynamic-event";

/**
 * A Component that let the user select from a list of entities
 */
@Component({
  selector: 'dontcode-reference',
  templateUrl: './abstract-reference.component.html',
  styleUrls: ['./abstract-reference.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  }
)
export class AbstractReferenceComponent extends AbstractDynamicComponent {

  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  @Output()
  valueChange = new EventEmitter<DynamicEvent>();

  /**
   * The json path to list the entities, ending with the property to use as a key and display (for example: $.creation.sources.name), to be provided by derived classes
   * @protected
   */
  protected targetEntitiesPos:string|null = null;

  protected targetEntitiesProperty:string|null = null;

  options = new Array<string>();

  constructor(@Optional() protected modelMgr:DontCodeModelManager, @Optional() protected storeMgr:DontCodeStoreManager) {
    super();
      // When loaded by Federation, sometimes the dtcde components are not injected.
    if (modelMgr==null) this.modelMgr=dtcde.getModelManager();
    if (storeMgr==null) this.storeMgr=dtcde.getStoreManager();
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

  providesTemplates(key?: string): TemplateList {
    return new TemplateList (this.inlineView, null, this.fullEditView);
  }

  protected setTargetEntitiesWithName (entityName:string, propertyName?:string): boolean {
    // We must find the list of possible shops
    const query="$.creation.entities[?(@.name=='"+entityName+"')]";
    this.targetEntitiesPos = this.modelMgr.queryModelToSingle(query).pointer;

    if (this.targetEntitiesPos==null)  return false;
    else {
      this.targetEntitiesProperty= propertyName??null;
      this.subscriptions.add(this.possibleValues().subscribe ({
        next: (value) => {
          this.options=value;
          },
        error: (err) => {
          this.options=['Shop 1', 'Shop 2'];
        }
      }));
      return true;
    }
  }

  possibleValues (): Observable<Array<string>> {
    if (this.targetEntitiesPos==null)  throw new Error ('Missing query of target entity for class '+this.constructor.name);
    const models=this.storeMgr.searchEntities(this.targetEntitiesPos);
    if (this.targetEntitiesProperty!=null){
      const property=this.targetEntitiesProperty;
      return models.pipe(
        map((loadedModels)=> {
          return loadedModels.map((model) => model[property]);
      }));
    } else return models;
  }

  override listEventSources(): DynamicEventSource[] {
    const ret= super.listEventSources();
    ret.push(
      new BaseDynamicEventSource ("Value", DynamicEventType.VALUE_CHANGE, this.valueChange.asObservable())
    );
    return ret;
  }

  valueChanged($event: any):void {
    this.valueChange.emit(new BaseDynamicEvent("Value", DynamicEventType.VALUE_CHANGE, $event.value));
  }

}
