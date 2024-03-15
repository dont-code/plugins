import {ChangeDetectorRef, Component, Inject, Injector, OnDestroy, OnInit, Type,} from '@angular/core';
import {
  ChangeType,
  Core,
  DontCodeModel,
  DontCodeModelManager,
  DontCodePreviewManager,
  DontCodeStoreManager,
  DontCodeStoreProvider,
  RepositorySchema,
} from '@dontcode/core';
import {IndexedDbStorageService} from '../../shared/storage/services/indexed-db-storage.service';
import {ChangeListenerService} from '../../shared/change/services/change-listener.service';
import {ChangeProviderService} from '../../shared/command/services/change-provider.service';
import {EMPTY, Subscription, firstValueFrom} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {GlobalPluginLoader} from '../../shared/plugins/global-plugin-loader';
import {CommonLibConfig, ComponentLoaderService, DONT_CODE_CORE} from "@dontcode/plugin-common";
import {RemotePluginLoaderService} from "../../shared/plugins/remote-plugin-loader.service";
import { HttpClient } from '@angular/common/http';
import { CommonConfigService } from '@dontcode/plugin-common';
import { SandboxRepositorySchema } from '../../shared/definitions';

@Component({
  template: '',
})
export abstract class BaseAppComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();

  sessionId: string | null = null;

  protected runtimeConfig = new DontCodeRuntimeConfig();

  constructor(
    protected provider: ChangeProviderService,
    protected storage:IndexedDbStorageService,
    protected listener:ChangeListenerService,
    protected pluginLoader: RemotePluginLoaderService,
    protected globalPluginLoader:GlobalPluginLoader,
    protected loaderService:ComponentLoaderService,
    protected changeProviderService: ChangeProviderService,
    protected configService: CommonConfigService,
    protected httpClient: HttpClient,
    protected injector: Injector,
    protected ref: ChangeDetectorRef,
    @Inject(DONT_CODE_CORE)
    protected dontCodeCore: Core,
    protected modelMgr:DontCodeModelManager,
    protected storeMgr:DontCodeStoreManager,
    protected previewMgr:DontCodePreviewManager
  ) {
  }

  ngOnInit(): void {
    // First load the repository 
    let repoUrl = this.runtimeConfig.repositoryUrl;
    if( repoUrl==null) repoUrl='assets/repositories/default.json';

    firstValueFrom (this.httpClient.get<RepositorySchema>(repoUrl, {observe:'body', responseType:'json'}))
      .then((config:SandboxRepositorySchema) => {
        const updates: {[P in keyof CommonLibConfig]:any}={};
        if( config.documentApiUrl!=null) updates.documentApiUrl=config.documentApiUrl;
        if( config.storeApiUrl!=null) updates.storeApiUrl = config.storeApiUrl;
        if( config.webSocketUrl!=null) updates.webSocketUrl = config.webSocketUrl;
        if( config.projectApiUrl!=null) updates.projectApiUrl = config.projectApiUrl;

        this.configService.batchUpdateConfig (updates);

        return this.pluginLoader.loadPluginsFromRepository(config, repoUrl).catch (
        reason => {
          if (this.runtimeConfig.forceRepositoryLoading)
            return Promise.reject(reason);
          else
            return Promise.resolve(null);
        }).then(() => {
          this.dontCodeCore.initPlugins();

            // Apply updates from repository
          const repoUpdates = this.pluginLoader.listAllRepositoryConfigUpdates();
          repoUpdates.forEach(update => {
            const chg = this.modelMgr.convertToChange(update);
            this.changeProviderService.pushChange(chg);
          });
          // eslint-disable-next-line no-restricted-syntax
          console.info('Dynamic Plugins inited');
          // Manage the global plugins
          this.globalPluginLoader.initLoading();

          this.initStoreProvider ();

          this.sessionId = this.runtimeConfig.sessionId??null;
          // eslint-disable-next-line no-restricted-syntax
          console.info('Browser opened with SessionId =', this.sessionId);
          this.listener.setSessionId(this.sessionId);
      
            // Once everything is finalized, let's give a chance to the caller to do something.
          this.afterInitialization ();
          this.ref.markForCheck();
          this.ref.detectChanges();
        });

    });

}

  /**
   * This is called after all plugins are loaded and inited, and the store provider configured
   */
  protected afterInitialization (): void {
    // Do nothing
  }

  initStoreProvider (): void {
    // Manage the store manager
    this.storeMgr.setProvider(this.storage);
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
                this.storeMgr.setProvider(this.storage);
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
              this.storeMgr
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
  }

  loadStoreManager(position: string): Promise<Type<DontCodeStoreProvider>> {
    const currentJson = this.provider.getJsonAt(position);

    const handler = this.previewMgr.retrieveHandlerConfig(position, currentJson);

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
