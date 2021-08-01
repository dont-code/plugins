import {DontCodeModelManager, DontCodeStoreCriteria, DontCodeStoreProvider, dtcde} from "@dontcode/core";
import {Observable, of, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Inject, Injectable, InjectionToken} from "@angular/core";
import { map } from "rxjs/operators";

export const DONTCODE_STORE_API_URL = new InjectionToken<string>('DontCodeStoreApiUrl');
/**
 * A Store Provider that uses the DontCode API to store / read application data
 */
@Injectable({
  providedIn: 'root'
})
export class DontCodeApiStoreProvider implements DontCodeStoreProvider {

  apiUrl: string;
  modelMgr: DontCodeModelManager;

  constructor(@Inject(HttpClient) protected http:HttpClient, @Inject(DONTCODE_STORE_API_URL) apiUrl?: string) {
    if( apiUrl)
      this.apiUrl = apiUrl;
    else {
      this.apiUrl = '';
      console.log ('DONTCODE_STORE_API_URL token not provided, hence cannot save to Api services');
    }
    this.modelMgr = dtcde.getModelManager();
  }

  storeEntity(position: string, data: any): Promise<any> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return Promise.reject("No entity found at position "+position);
    }

    if( data._id) {
      return this.http.put(this.apiUrl+'/'+entity.name+'/'+data._id, data, {observe:"body", responseType:"json"}).toPromise();
    } else {
      return this.http.post(this.apiUrl+'/'+entity.name, data, {observe:"body", responseType:"json"}).toPromise();
    }
  }

  loadEntity(position: string, key: any): Promise<any> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return Promise.reject("No entity found at position "+position);
    }

    const obs = this.http.get(this.apiUrl+'/'+entity.name+'/'+key, {observe:"body", responseType:"json"});
    return obs.toPromise();
  }

  deleteEntity(position: string, key: any): Promise<boolean> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return Promise.reject("No entity found at position "+position);
    }

    return this.http.delete(this.apiUrl+'/'+entity.name+'/'+key, {observe:"body", responseType:"json"}).toPromise().then(value => {
      return true;
    });
    }

  searchEntities(position: string, ...criteria: DontCodeStoreCriteria[]): Observable<any[]> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return throwError("No entity found at position "+position);
    }

    return this.http.get(this.apiUrl+'/'+entity.name, {observe:"body", responseType:"json"}).pipe(map(value => {
            return value as Array<any>;
          }
        ));
    }

}
