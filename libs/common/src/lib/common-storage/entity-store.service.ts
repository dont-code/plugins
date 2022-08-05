import {Injectable} from '@angular/core';
import {DontCodeStoreManager} from "@dontcode/core";
import {map} from "rxjs/operators";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntityStoreService {

  constructor(protected storeMgr:DontCodeStoreManager) { }

  retrieveListManager (position:string, description:any): EntityListManager {
    return new EntityListManager(position, description, this.storeMgr);
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

  constructor(position:string, description: any, protected storeMgr:DontCodeStoreManager) {
    this.position = position;
    this.description = description;
  }

  push (element:any):void {
    this.entities = [...this.entities, element];
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
    return this.storeMgr.deleteEntity(this.position, element._id).then(deleted => {
      if( deleted)
        this.entities = this.entities.filter(val => (val!==element));
      return deleted;
    }).catch((reason:Error) => {
      console.error(reason.message);
      return false;
    });
  }

  reset (): void {
    this.entities.length=0;
  }

  store (element:any): Promise<any> {
    return this.storeMgr.storeEntity(this.position, element);
  }

  loadAll (): Promise<void> {
    return lastValueFrom(this.storeMgr.searchEntities(this.position).pipe(
      map (values => {
        this.entities = [...values];
      return;
    })
    ), {defaultValue:undefined});
  }

  /**
   * Loads the detail of an already loaded item.
   * @param toLoad
   */
  loadDetailFromKey (key:any): Promise<any> {
    if( key==null)
      return Promise.reject("Cannot load entity with null key");
    return this.storeMgr.loadEntity(this.position, key).then(loaded => {
      if (loaded!=null) {
        this.replace(loaded);
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
