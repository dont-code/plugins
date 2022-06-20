import {Component, Injector, OnDestroy, OnInit, Type,} from '@angular/core';
import {ChangeType, DontCodeModel, DontCodeStoreProvider, dtcde,} from '@dontcode/core';
import {IndexedDbStorageService} from '../../shared/storage/services/indexed-db-storage.service';
import {ChangeListenerService} from '../../shared/change/services/change-listener.service';
import {ChangeProviderService} from '../../shared/command/services/change-provider.service';
import {EMPTY, Subscription} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {GlobalPluginLoader} from '../../shared/plugins/global-plugin-loader';
import {ComponentLoaderService} from "@dontcode/plugin-common";
import {RemotePluginLoaderService} from "../../shared/plugins/remote-plugin-loader.service";

@Component({
  template: '',
})
export abstract class BaseAppComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();

  sessionId: string | null = null;
  protected pluginsLoaded?:Promise<any>;

  protected runtimeConfig = new DontCodeRuntimeConfig();

  constructor(
    protected provider: ChangeProviderService,
    protected storage:IndexedDbStorageService,
    protected listener:ChangeListenerService,
    protected pluginLoader: RemotePluginLoaderService,
    protected globalPluginLoader:GlobalPluginLoader,
    protected loaderService:ComponentLoaderService,
    protected injector: Injector) {
  }

  ngOnInit(): void {
    const repoUrl = this.runtimeConfig.repositoryUrl;
    this.pluginsLoaded=this.pluginLoader.loadPluginsFromRepository(repoUrl, 'assets/repositories/default.json').catch (
      reason => {
        if (this.runtimeConfig.forceRepositoryLoading)
          return Promise.reject(reason);
        else
          return Promise.resolve(null);
      }
    ).then(value => {
      dtcde.initPlugins();

        // Apply updates from repository
      const repoUpdates = this.pluginLoader.listAllRepositoryConfigUpdates();
      dtcde.getModelManager().applyPluginConfigUpdates(repoUpdates);

      // eslint-disable-next-line no-restricted-syntax
      console.info('Dynamic Plugins inited');
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
              return EMPTY;
            }),
            map((storeProvider) => {
              if (storeProvider!=null) {
                const updatedInjector = Injector.create({
                  providers: [storeProvider as any],
                    parent: this.injector});
                dtcde
                  .getStoreManager()
                  .setProvider(updatedInjector.get(storeProvider));
                // eslint-disable-next-line no-restricted-syntax
                console.info("Set new provider to:", storeProvider);
              }
              return storeProvider;
            })
          )
          .subscribe({
            error(error) {
              console.error('Cannot load StoreProvider due to', error);
            },
          })
      );

      this.sessionId = this.runtimeConfig.sessionId??null;
      // eslint-disable-next-line no-restricted-syntax
      console.info('Browser opened with SessionId =', this.sessionId);
      this.listener.setSessionId(this.sessionId);
    });
  }

  loadStoreManager(position: string): Promise<Type<DontCodeStoreProvider>> {
    const previewMgr = dtcde.getPreviewManager();
    const currentJson = this.provider.getJsonAt(position);

    const handler = previewMgr.retrieveHandlerConfig(position, currentJson);

    if (handler) {
      // eslint-disable-next-line no-restricted-syntax
      console.debug('Importing StoreManager from ', handler.class.source);
      // First lets try if the plugin is imported during the compilation
      return this.loaderService.loadPluginModule(handler).then(module => {

        const providerClass:Type<DontCodeStoreProvider> = module.instance
          .exposedPreviewHandlers()
          .get(handler.class.name);
        // eslint-disable-next-line no-restricted-syntax
        console.debug('Provider Class found:', providerClass);

        return providerClass;
      });
    }
    return Promise.reject('No handler found for storemanager '+currentJson);
  }

  mainTab(): boolean {
    return window.location.hash.indexOf('/newTabDev') === -1;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export class DontCodeRuntimeConfig {
  sessionId?:string;
  projectId?:string;
  runtime=false;
  forceRepositoryLoading=false;
  repositoryUrl?:string;
}
