import {
  AbstractDontCodeStoreProvider,
  DontCodeModelManager,
  DontCodeStoreCriteria,
  dtcde,
  StoreProviderHelper,
  UploadedDocumentInfo
} from "@dontcode/core";
import {lastValueFrom, Observable, Subscription, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, OnDestroy, Optional} from "@angular/core";
import {map, mergeAll} from "rxjs/operators";
import {CommonConfigService, CommonLibConfig} from "@dontcode/plugin-common";

/**
 * A Store Provider that uses the DontCode API to store / read application data
 */
@Injectable({
  providedIn: 'root'
})
export class DontCodeApiStoreProvider<T=never> extends AbstractDontCodeStoreProvider<T> implements OnDestroy {

  apiUrl: string;
  docUrl: string;
  subscriptions = new Subscription();

  constructor(protected http: HttpClient, @Optional() protected override modelMgr: DontCodeModelManager, protected configService: CommonConfigService) {
    super();
    this.apiUrl = 'https://test.dont-code.net/data';
    this.docUrl = 'https://test.dont-code.net/documents';

    this.updateConfig (this.configService.getConfig());
    this.subscriptions.add (this.configService.getUpdates ().pipe (map ((updatedConfig) => {
      this.updateConfig (updatedConfig);
    })).subscribe());

      // Hack for when DI cannot provide the ModelManager due to some weird stuff
    if (this.modelMgr==null) {
      this.modelMgr = dtcde.getModelManager();
      console.warn("DontCodeModelManager not found by Angular's DI");
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateConfig(newConfig: Readonly<CommonLibConfig>) {
    if (newConfig.storeApiUrl!=null)
      this.apiUrl = newConfig.storeApiUrl;
    if (newConfig.documentApiUrl!=null)
      this.docUrl = newConfig.documentApiUrl;
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
