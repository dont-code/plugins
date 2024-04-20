import {ChangeDetectorRef, Component, Inject, Injector, OnDestroy, OnInit,} from '@angular/core';
import {
  Core,
  RepositorySchema,
} from '@dontcode/core';
import {Subscription, firstValueFrom} from 'rxjs';
import {CommonLibConfig, DONT_CODE_CORE} from "@dontcode/plugin-common";
import { HttpClient } from '@angular/common/http';
import { CommonConfigService } from '@dontcode/plugin-common';
import { SandboxRepositorySchema } from '../../shared/definitions';

/**
 * An AppComponent that loads dynamically the repository configuration
 */
@Component({
  template: '',
})
export abstract class LightAppComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();

  protected runtimeConfig = new DontCodeRuntimeConfig();

  protected defaultRepositoryUrl = 'assets/repositories/default.json';

  constructor(
    protected configService: CommonConfigService,
    protected httpClient: HttpClient,
    protected injector: Injector,
    protected ref: ChangeDetectorRef,
    @Inject(DONT_CODE_CORE)
    protected dontCodeCore: Core,
  ) {
  }

  /**
   * Reads configuration from the repository file
   */
  ngOnInit(): void {
    // First load the repository 
    const repoUrl = this.runtimeConfig.repositoryUrl || this.defaultRepositoryUrl;

    firstValueFrom (this.httpClient.get<RepositorySchema>(repoUrl, {observe:'body', responseType:'json'}))
      .then((config:SandboxRepositorySchema) => {
        const updates: {[P in keyof CommonLibConfig]:any}={};
        if( config.documentApiUrl!=null) updates.documentApiUrl=config.documentApiUrl;
        if( config.storeApiUrl!=null) updates.storeApiUrl = config.storeApiUrl;
        if( config.webSocketUrl!=null) updates.webSocketUrl = config.webSocketUrl;
        if( config.ideWebSocketUrl!=null) updates.ideWebSocketUrl = config.ideWebSocketUrl;
        if( config.projectApiUrl!=null) updates.projectApiUrl = config.projectApiUrl;

        this.configService.batchUpdateConfig (updates);

          // Once everything is finalized, let's give a chance to the caller to do something.
        return this.afterInitialization (config, repoUrl);
      }).then ( () => {
        this.ref.markForCheck();
        this.ref.detectChanges();

      });

}

  /**
   * This is called after all plugins are loaded and inited, and the store provider configured
   */
  protected afterInitialization (config:SandboxRepositorySchema, repoUrl:string): Promise<void> {
    return Promise.resolve();
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
