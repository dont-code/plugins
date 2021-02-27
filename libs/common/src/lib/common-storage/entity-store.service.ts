import { Injectable } from '@angular/core';
import {dtcde} from "@dontcode/core";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EntityStoreService {

  constructor() { }

  retrieveListManager (position:string, description:any): EntityListManager {
    return new EntityListManager(position, description);
  }
}

/**
 * Manages a list of any object in a way that Angular detects the changes
 */
export class EntityListManager {
  protected position: string;
  protected description:any;
  /**
   * The array of entities to use
   */
  entities = new Array<any>();

  constructor(position:string, description: any) {
    this.position = position;
    this.description = description;
  }

  push (element:any):void {
    this.entities = [...this.entities, element];
  }

  remove (element:any): void {
    this.entities = this.entities.filter(val => (val!==element));
  }

  reset (): void {
    this.entities.length=0;
  }

  store (element:any): Promise<any> {
    return dtcde.getStoreManager().storeEntity(this.position, element);
  }

  loadAll (): Promise<void> {
    return dtcde.getStoreManager().searchEntities(this.position).pipe(
      map (values => {
        this.entities = [...this.entities, ...values];
      return;
    })
    ).toPromise();
  }
}
