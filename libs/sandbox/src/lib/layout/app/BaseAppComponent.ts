import {
  Component, createNgModuleRef,
  getModuleFactory, getNgModuleById,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ChangeType,
  DontCodeModel,
  dtcde,
  PluginModuleInterface,
} from '@dontcode/core';
import { IndexedDbStorageService } from '../..//shared/storage/services/indexed-db-storage.service';
import { ChangeListenerService } from '../../shared/change/services/change-listener.service';
import { ChangeProviderService } from '../../shared/command/services/change-provider.service';
import { EMPTY, from, Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { GlobalPluginLoader } from '../../shared/plugins/global-plugin-loader';
import {HttpClient} from "@angular/common/http";

@Component({
  template: '',
})
export abstract class BaseAppComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();

  sessionId: string | null = null;

  constructor(protected provider: ChangeProviderService, protected storage:IndexedDbStorageService, protected listener:ChangeListenerService, protected globalPluginLoader:GlobalPluginLoader) {
  }

  ngOnInit(): void {
    // Manage the global plugins
    this.globalPluginLoader.initLoading(dtcde.getPreviewManager());
    // Manage the store manager
    dtcde.getStoreManager().setProvider(this.storage);
    this.subscription.add(
      this.provider
        .receiveCommands(
          DontCodeModel.APP_SHARING,
          DontCodeModel.APP_SHARING_WITH_NODE
        )
        .pipe(
          mergeMap((change) => {
            if (change.type !== ChangeType.DELETE) {
              if (change.value === 'No-one') {
                dtcde.getStoreManager().setProvider(this.storage);
                return EMPTY;
              } else if (change.value) {
                return this.loadStoreManager(DontCodeModel.APP_SHARING_WITH);
              } else {
                return EMPTY;
              }
            }
            return from([change]);
          }),
          map((storeProvider) => {
            if (storeProvider) {
              const updatedInjector = Injector.create({ providers: [storeProvider]});
//              console.log("Injector:", updatedInjector.get(HttpClient));
              dtcde
                .getStoreManager()
                .setProvider(updatedInjector.get(storeProvider));
            }
            return storeProvider;
          })
        )
        .subscribe({
          error(error) {
            console.log('Cannot load StoreProvider due to', error);
          },
        })
    );

    this.sessionId = (window as any).dontCodeConfig?.sessionId;
    console.log('Browser opened with SessionId =', this.sessionId);
    this.listener.setSessionId(this.sessionId);
  }

  loadStoreManager(position: string): Observable<any> {
    const previewMgr = dtcde.getPreviewManager();
    const currentJson = this.provider.getJsonAt(position);

    const handler = previewMgr.retrieveHandlerConfig(position, currentJson);

    if (handler) {
      console.log('Importing StoreManager from ', handler.class.source);
      try {
        // First lets try if the plugin is imported during the compilation
        const module = createNgModuleRef(getNgModuleById<PluginModuleInterface>('dontcode-plugin/' + handler.class.source)).instance;

/*        const module: PluginModuleInterface = getModuleFactory(
          'dontcode-plugin/' + handler.class.source
        ).create(this.injector).instance;*/
        const providerClass = module
          .exposedPreviewHandlers()
          .get(handler.class.name);
        console.log('Provider Class found:', providerClass);

        return of(providerClass);
      } catch (e) {
        // Nope, fallback to dynamically loading it
      }
    }
    return EMPTY;
  }

  mainTab(): boolean {
    return window.location.hash.indexOf('/newTabDev') === -1;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
