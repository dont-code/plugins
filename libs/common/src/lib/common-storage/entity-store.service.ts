import {Injectable} from '@angular/core';
import {
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

@Injectable({
  providedIn: 'root'
})
export class EntityStoreService {

  protected listsByPosition = new Map<string, EntityListManager<any>> ();
  constructor(protected storeMgr:DontCodeStoreManager) { }

  retrieveListManager<T=never> (position:string, description:any): EntityListManager<T> {
    let newOne:EntityListManager<any>|undefined = this.listsByPosition.get(position);
    if (newOne == null){
      newOne = new EntityListManager<T>(position, description, this.storeMgr);
      this.listsByPosition.set(position, newOne);
    }
    return newOne;
  }
}

/**
 * Manages a list of any object stored by the Dont-Code StoreManager in a way that Angular detects the changes
 */
export class EntityListManager<T=never> {
  protected position: string;
  protected description:any;
  /**
   * The array of entities to use
   */
  entities = new Array<T>();
  prepared : DontCodeStorePreparedEntities<T>|null = null;

  constructor(position:string, description: any, protected storeMgr:DontCodeStoreManager) {
    this.position = position;
    this.description = description;
  }

  push (element:T):void {
    this.entities = [...this.entities, element];
  }

  updateWithDetailedEntity (element:T):T {
    const elementId=(element as any)._id;
    const updated = new Array<T>();
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
    return element;
  }

  replace (element:T):boolean {
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
    const elementId=(element as any)._id;
    if (elementId==null)  // Not saved yet, so just remove it from the list
    {
      return new Promise (resolve => {
        this.entities = this.entities.filter(val => (val!==element));
        this.prepared=null;
        resolve( true);
      });
    }else {
    return this.storeMgr.deleteEntity(this.position, elementId).then(deleted => {
      if( deleted) {
        this.entities = this.entities.filter(val => (val!==element));
        this.prepared=null;
      }
      return deleted;
    }).catch((reason:Error) => {
      console.error(reason.message);
      return false;
    });
    }
  }

  reset (): void {
    this.entities.length=0;
    this.prepared=null;
  }

  store (element:any): Promise<any> {
    this.prepared=null;
    return this.storeMgr.storeEntity(this.position, element);
  }

  loadAll (): Promise<void> {
    return firstValueFrom(this.storeMgr.searchEntities(this.position).pipe(
      map (values => {
        this.prepared=null;
        this.entities = [...values];
      return;
    })
    ), {defaultValue:undefined});
  }

  searchAndPrepareEntities(
    sort?:DontCodeReportSortType[]|undefined,
    groupBy?:DontCodeReportGroupType[]|undefined,
    ...criteria: DontCodeStoreCriteria[]
  ): Promise<void> {
    const sortStore = ((sort!=null) && (sort.length>0))?sort[0]:undefined;
    const groupByStore= ((groupBy!=null) && (groupBy.length>0))?new DontCodeStoreGroupby(groupBy[0].of,groupBy[0].display):undefined;
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
        groupedValues=StoreProviderHelper.calculateGroupedByValues(sortedValues, groupByStore);
      }
      if ((criteria!=null) || (sort!=null) || (groupBy!=null)) {
        this.prepared=new DontCodeStorePreparedEntities<any>(sortedValues, sortStore, groupedValues);
      }
      return Promise.resolve();
    } else {
      // Not loaded already, just ask the store to do it
      return firstValueFrom(this.storeMgr.searchAndPrepareEntities(this.position, sortStore, groupByStore, ...criteria).pipe(
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
    return this.storeMgr.loadEntity(this.position, key).then(loaded => {
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
