import {Injectable} from '@angular/core';
import {DontCodeStoreManager} from "@dontcode/core";
import {map} from "rxjs/operators";

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
    return this.storeMgr.searchEntities(this.position).pipe(
      map (values => {
        this.entities = [...this.entities, ...values];
      return;
    })
    ).toPromise();
  }
}
