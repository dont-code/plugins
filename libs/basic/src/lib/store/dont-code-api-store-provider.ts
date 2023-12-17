import {
  AbstractDontCodeStoreProvider,
  DontCodeModelManager,
  DontCodeStoreCriteria,
  dtcde,
  StoreProviderHelper,
  UploadedDocumentInfo
} from "@dontcode/core";
import {lastValueFrom, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Inject, Injectable, Optional} from "@angular/core";
import {map, mergeAll} from "rxjs/operators";
import {DONT_CODE_DOC_API_URL, DONT_CODE_STORE_API_URL} from "@dontcode/plugin-common";

/**
 * A Store Provider that uses the DontCode API to store / read application data
 */
@Injectable({
  providedIn: 'root'
})
export class DontCodeApiStoreProvider<T=never> extends AbstractDontCodeStoreProvider<T> {

  apiUrl: string;
  docUrl: string;

  constructor(protected http: HttpClient, @Optional() protected override modelMgr: DontCodeModelManager, @Optional() @Inject(DONT_CODE_STORE_API_URL) apiUrl?: string, @Optional() @Inject(DONT_CODE_DOC_API_URL) docUrl?: string) {
    super();
    if (apiUrl)
      this.apiUrl = apiUrl;
    else {
      this.apiUrl = 'https://test.dont-code.net/data';
      console.log('DONTCODE_STORE_API_URL token not provided, hence using default test.dont-code.net/data url.');
    }
    if (docUrl)
      this.docUrl = docUrl;
    else {
      this.docUrl = 'https://test.dont-code.net/documents';
      console.log('DONTCODE_STORE_DOC_URL token not provided, hence using default test.dont-code.net/documents url.');
    }
      // Hack for when DI cannot provide the ModelManager due to some weird stuff
    if (this.modelMgr==null) {
      this.modelMgr = dtcde.getModelManager();
      console.warn("DontCodeModelManager not found by Angular's DI");
    }
  }

  storeEntity(position: string, data: T): Promise<T> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return Promise.reject("No entity found at position "+position);
    }

    const id=(data as any)._id;
    if( id != undefined) {
      return lastValueFrom(this.http.put<T>(this.apiUrl+'/'+entity.name+'/'+id, data, {observe:"body", responseType:"json"}));
    } else {
      return lastValueFrom(this.http.post<T>(this.apiUrl+'/'+entity.name, data, {observe:"body", responseType:"json"}));
    }
  }

  loadEntity(position: string, key: any): Promise<T|undefined> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return Promise.reject("No entity found at position "+position);
    }

    const obs = this.http.get<T>(this.apiUrl+'/'+entity.name+'/'+key, {observe:"body", responseType:"json"});
    return lastValueFrom(obs);
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

  override searchEntities(position: string, ...criteria: DontCodeStoreCriteria[]): Observable<T[]> {
    const entity = this.modelMgr.findAtPosition(position, false);
    if (entity === null)  {
      return throwError(()=> new Error ("No entity found at position "+position));
    }

    return this.http.get(this.apiUrl+'/'+entity.name, {observe:"body", responseType:"json"}).pipe(map(value => {
            return StoreProviderHelper.applyFilters( value as Array<any>, ...criteria);
          }
        ));
    }

  canStoreDocument(position?: string): boolean {
    return true;
  }

  storeDocuments(toStore: File[], position?: string): Observable<UploadedDocumentInfo> {
    const myFormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let count=0;
    // store files details into formdata
    toStore.forEach( file => {
      myFormData.append('document#'+count, file);
      count++;
    });
    //HTTP Angular service, which will send call to Laravel API With headers and myformdata
    return this.http.post<UploadedDocumentInfo[]>(this.docUrl, myFormData, { headers: headers }).pipe(
      mergeAll ()
    );
  }

}
