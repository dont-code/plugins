import {Injectable} from '@angular/core';
import {
  DontCodeModelManager, DontCodeModelPointer,
  DontCodeReportGroupType,
  DontCodeReportSortType,
  DontCodeStoreCriteria,
  DontCodeStoreGroupby,
  DontCodeStoreManager,
  DontCodeStorePreparedEntities,
  StoreProviderHelper
} from "@dontcode/core";
import {map} from "rxjs/operators";
import {firstValueFrom} from "rxjs";
import {DontCodeDataTransformer} from "@dontcode/core/src/lib/store/dont-code-data-transformer";

@Injectable({
  providedIn: 'root'
})
export class EntityStoreService {

  protected listsByPosition = new Map<string, EntityListManager<any>> ();
  constructor(protected storeMgr:DontCodeStoreManager, protected modelMgr:DontCodeModelManager) { }

  retrieveListManager<T=never> (pointer:DontCodeModelPointer, description:any, ): EntityListManager<T> {
    let newOne:EntityListManager<any>|undefined = this.listsByPosition.get(pointer.position);
    if (newOne == null){
      newOne = new EntityListManager<T>(pointer, description, this.storeMgr, this.modelMgr);
      this.listsByPosition.set(pointer.position, newOne);
    }
    return newOne;
  }
}

/**
 * Manages a list of any object stored by the Dont-Code StoreManager in a way that Angular detects the changes
 */
export class EntityListManager<T=never> {
  protected pointer: DontCodeModelPointer;
  protected description:any;
  /**
   * The array of entities to use
   */
  entities: T[]|null = null;
  prepared : DontCodeStorePreparedEntities<T>|null = null;

  constructor(pointer:DontCodeModelPointer, description: any, protected storeMgr:DontCodeStoreManager, protected modelMgr:DontCodeModelManager) {
    this.pointer = pointer;
    this.description = description;
  }

  push (element:T):void {
    if (this.entities==null)
      this.entities=new Array<T>(element);
    else
      this.entities = [...this.entities, element];
  }

  updateWithDetailedEntity (element:T):T {
    const elementId=(element as any)._id;
    const updated = new Array<T>();
    if (this.entities!=null) {
      this.entities.forEach(value => {
        const valueId=(value as any)._id;
        if( valueId==elementId) {
          element={...element, ...value};
          updated.push(element);
        }else {
          updated.push(value);
        }
      })
      this.entities = [...updated];
    } else {
      this.entities = [element];
    }
    return element;
  }

  replace (element:T):boolean {
    if (this.entities==null) return false;

    const elementId=(element as any)._id;
    let ret=false;
    const updated = new Array<T>();
    this.entities.forEach(value => {
      const valueId=(value as any)._id;
      if( valueId==elementId) {
        updated.push(element);
        ret = true;
      }else {
        updated.push(value);
      }
    })
    this.entities = [...updated];
    return ret;
  }

  remove (element:T): Promise<boolean> {
    if (this.entities==null) return Promise.resolve(false);

    const elementId=(element as any)._id;
    if (elementId==null)  // Not saved yet, so just remove it from the list
    {
      return new Promise (resolve => {
        if (this.entities!=null) {
          this.entities = this.entities.filter(val => (val!==element));
          this.prepared=null;
          resolve( true);
        } else resolve (false);
      });
    }else {
    return this.storeMgr.deleteEntity(this.pointer.position, elementId).then(deleted => {
      if( deleted) {
        if (this.entities!=null) {
          this.entities = this.entities.filter(val => (val!==element));
          this.prepared=null;
        }
      }
      return deleted;
    }).catch((reason:Error) => {
      console.error(reason.message);
      return false;
    });
    }
  }

  reset (): void {
    if( this.entities!=null)
      this.entities.length=0;
    this.prepared=null;
  }

  store (element:any): Promise<any> {
    this.prepared=null;
    return this.storeMgr.storeEntity(this.pointer.position, element);
  }

  loadAll (): Promise<void> {
    return firstValueFrom(this.storeMgr.searchEntities(this.pointer.position).pipe(
      map (values => {
        this.prepared=null;
        this.entities = [...values];
      return;
    })
    ), {defaultValue:undefined});
  }

  searchAndPrepareEntities(
    sort?:{[key:string]:DontCodeReportSortType}|undefined,
    groupBy?:{[key:string]:DontCodeReportGroupType}|undefined,
    dataTransformer?:DontCodeDataTransformer,
    ...criteria: DontCodeStoreCriteria[]
  ): Promise<void> {
      // It only supports one groupby and one sortby for now, so just find one if any
    let listOfValues:any[] = (sort!=null)?Object.values(sort):[];
    const sortStore = (listOfValues.length>0)?listOfValues[0]:undefined;
    listOfValues=(groupBy!=null)?Object.values(groupBy):[];
    const groupByStore= (listOfValues.length>0)?new DontCodeStoreGroupby(listOfValues[0].of,listOfValues[0].display, listOfValues[0].show):undefined;
    if (this.entities!=null) {
      this.prepared=null;
      // Already loaded, just sort & group
      let sortedValues= this.entities;
      let groupedValues=undefined;

      if( criteria!=null)
        sortedValues=StoreProviderHelper.applyFilters(sortedValues, ...criteria);
      if (sortStore!=null){
        sortedValues=StoreProviderHelper.multiSortArray(sortedValues,sortStore);
      }
      if (groupByStore!=null){
        groupedValues=StoreProviderHelper.calculateGroupedByValues(sortedValues, groupByStore, this.modelMgr, this.pointer);
      }
      if ((criteria!=null) || (sort!=null) || (groupBy!=null)) {
        this.prepared=new DontCodeStorePreparedEntities<any>(sortedValues, sortStore, groupedValues);
      }
      return Promise.resolve();
    } else {
      // Not loaded already, just ask the store to do it
      return firstValueFrom(this.storeMgr.searchAndPrepareEntities(this.pointer.position, sortStore, groupByStore, dataTransformer, ...criteria).pipe(
        map (value => {
          this.prepared=value;
          this.entities=this.prepared.sortedData;
        }))
      )
    }
  }


  /**
   * Loads the detail of an already loaded item. Makes sure it only add any additional fields without changing any values of the item in memory
   * @param toLoad
   */
  loadDetailFromKey (key:any): Promise<any> {
    if( key==null)
      return Promise.reject("Cannot load entity with null key");
    return this.storeMgr.loadEntity(this.pointer.position, key).then(loaded => {
      if (loaded!=null) {
        return this.updateWithDetailedEntity(loaded);
      }
      return loaded;
    });
  }
    /**
   * Loads the detail of an already loaded item.
   * @param toLoad
   */
  loadDetailOf (toLoad:any): Promise<any> {
    return this.loadDetailFromKey(toLoad._id);
  }
}
