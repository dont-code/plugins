import {Injectable} from '@angular/core';
import {
  DontCodeStoreCriteria,
  DontCodeStoreGroupby,
  DontCodeStoreManager,
  DontCodeStorePreparedEntities,
  DontCodeStoreSort, StoreProviderHelper
} from "@dontcode/core";
import {map} from "rxjs/operators";
import {firstValueFrom, lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntityStoreService {

  protected listsByPosition = new Map<string, EntityListManager> ();
  constructor(protected storeMgr:DontCodeStoreManager) { }

  retrieveListManager (position:string, description:any): EntityListManager {
    let newOne = this.listsByPosition.get(position);
    if (newOne == null){
      newOne = new EntityListManager(position, description, this.storeMgr);
      this.listsByPosition.set(position, newOne);
    }
    return newOne;
  }
}

/**
 * Manages a list of any object stored by the Dont-Code StoreManager in a way that Angular detects the changes
 */
export class EntityListManager {
  protected position: string;
  protected description:any;
  /**
   * The array of entities to use
   */
  entities = new Array<any>();
  prepared : DontCodeStorePreparedEntities<any>|null = null;

  constructor(position:string, description: any, protected storeMgr:DontCodeStoreManager) {
    this.position = position;
    this.description = description;
  }

  push (element:any):void {
    this.entities = [...this.entities, element];
  }

  updateWithDetailedEntity (element:any):any {
    const updated = new Array();
    this.entities.forEach(value => {
      if( value._id==element._id) {
        element={...element, ...value};
        updated.push(element);
      }else {
        updated.push(value);
      }
    })
    this.entities = [...updated];
    return element;
  }

  replace (element:any):boolean {
    let ret=false;
    const updated = new Array();
    this.entities.forEach(value => {
      if( value._id==element._id) {
        updated.push(element);
        ret = true;
      }else {
        updated.push(value);
      }
    })
    this.entities = [...updated];
    return ret;
  }

  remove (element:any): Promise<boolean> {
    if (element._id==null)  // Not saved yet, so just remove it from the list
    {
      return new Promise (resolve => {
        this.entities = this.entities.filter(val => (val!==element));
        this.prepared=null;
        resolve( true);
      });
    }else {
    return this.storeMgr.deleteEntity(this.position, element._id).then(deleted => {
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
    sort?:DontCodeStoreSort,
    groupBy?:DontCodeStoreGroupby,
    ...criteria: DontCodeStoreCriteria[]
  ): Promise<void> {
    if (this.entities!=null) {
      this.prepared=null;
      // Already loaded, just sort & group
      let sortedValues= this.entities;
      let groupedValues=undefined;
      if( criteria!=null)
        sortedValues=StoreProviderHelper.applyFilters(sortedValues, ...criteria);
      if (sort!=null)
        sortedValues=StoreProviderHelper.multiSortArray(sortedValues, sort);
      if (groupBy!=null)
        groupedValues=StoreProviderHelper.calculateGroupedByValues(sortedValues, groupBy);
      if ((criteria!=null) || (sort!=null) || (groupBy!=null)) {
        this.prepared=new DontCodeStorePreparedEntities<any>(sortedValues, sort, groupedValues);
      }
      return Promise.resolve();
    } else {
      // Not loaded already, just ask the store to do it
      return firstValueFrom(this.storeMgr.searchAndPrepareEntities(this.position, sort, groupBy, ...criteria).pipe(
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
