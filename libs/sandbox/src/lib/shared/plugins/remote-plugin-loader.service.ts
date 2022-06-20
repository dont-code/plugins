import {Injectable, Injector} from '@angular/core';
import {loadRemoteModule, LoadRemoteModuleOptions,} from '@angular-architects/module-federation-runtime';
import {DefinitionUpdateConfig, PluginModuleInterface, RepositoryPluginEntry, RepositorySchema} from '@dontcode/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {ComponentLoaderService} from "@dontcode/plugin-common";

export type RemotePluginModuleOptions = LoadRemoteModuleOptions & {
  moduleId: string;
};

/**
 * Loads any plugins remotely as defined per the configuration
 */
@Injectable({
  providedIn: 'root',
})
export class RemotePluginLoaderService {

  repository:RepositorySchema|null=null;

  constructor( protected compLoader: ComponentLoaderService, protected injector: Injector, protected httpClient: HttpClient) {}

  /**
   * Loads the configuration file of the plugin repository, then loads and configure all plugins in it
   * @param repoUrl
   */
  loadPluginsFromRepository (repoUrl:string|undefined, defaultRepoUrl:string) : Promise<RepositorySchema>{
/*    this.httpClient.get<RepositorySchema>(repoUrl, {observe:'events', responseType:'json'}).subscribe({
      next: value => {
        console.log("Received", value);
      },
      error: err => {
        console.error("Error ", err)
      },
      complete: () => {
        console.log("Complete");
      }
    });*/

    if( repoUrl==null) repoUrl=defaultRepoUrl;
    // eslint-disable-next-line no-restricted-syntax
    console.info("Loading plugins from repository url", repoUrl);
    return firstValueFrom(
      this.httpClient.get<RepositorySchema>(repoUrl, {observe:'body', responseType:'json'})
      ).then((config:RepositorySchema) => {
        this.repository = config;
        if (config.plugins != null) {
          const toLoad=new Array<RemotePluginModuleOptions>();
          config.plugins.forEach(value => {
            toLoad.push(this.createRemotePluginConfig (value, defaultRepoUrl));
          });
          // eslint-disable-next-line no-restricted-syntax
          console.debug("Loading following plugins", config.plugins);
          return this.loadMultipleModules(toLoad);
        }
        return Promise.resolve([]);
    }).then (() => {
      if( this.repository!=null)
        return this.repository;
      else {
        return Promise.reject("No repository loaded");
      }
    })
      .catch((reason)=> {
      console.error("Cannot load repository config from "+repoUrl+" due to error ", reason);
      return Promise.reject(reason);
    })
  }

  protected createRemotePluginConfig(value: RepositoryPluginEntry, defaultRepoUrl:string): RemotePluginModuleOptions {
    let ret:RemotePluginModuleOptions;
    const upperId = value.id.substring(0,1).toUpperCase()+value.id.substring(1);

    if (value.info != null) {
      const exposedModule = value.info["exposed-module"]??'./'+upperId;
      const remoteEntry = value.info["remote-entry"]??defaultRepoUrl+'/remoteEntry.mjs';

      ret = {
        type: 'module',
        moduleId: value.id,
        exposedModule: exposedModule,
        remoteEntry: remoteEntry
      }
    }else {
      ret = {
        type: 'module',
        moduleId: value.id,
        exposedModule:'./'+upperId,
        remoteEntry:defaultRepoUrl+'/remoteEntry.mjs'
      }
    }

    return ret;
  }

  /**
   * Returns all the plugin configuration overriden by the repository.
   */
  listAllRepositoryConfigUpdates (): Array<DefinitionUpdateConfig> {
    const ret = new Array<DefinitionUpdateConfig>();
    this.repository?.plugins?.forEach(value => {
      if ((value.config != null) && (value.config["definition-updates"] != null)) {
        value.config["definition-updates"].forEach(update => {
          ret.push(update);
          })
        }
      }
    );

    return ret;
  }

  /**
   * Loads a module containing plugins from a remote location using Module Federation
   * @param moduleDef
   * @param moduleName
   */
  async loadModule(
    moduleDef: RemotePluginModuleOptions
  ): Promise<PluginModuleInterface> {
    const module = await loadRemoteModule(moduleDef);
    //console.log('Loaded Module:', module);
/*    const mainModuleClass = module[moduleDef.moduleId];
    if (mainModuleClass==null)  // The main module class is not defined
    {
      throw new Error("ModuleClass "+moduleDef.moduleId+" not exported in "+moduleDef.remoteEntry);
    }*/
    const mainModule = await this.compLoader.getOrCreatePluginModuleRef(moduleDef.moduleId.toLowerCase());
    //createNgModuleRef<PluginModuleInterface>(mainModuleClass, this.injector).instance;
    return mainModule.instance;
  }

  /**
   * Loads a list of modules
   * @param moduleDefs
   */
  async loadMultipleModules(
    moduleDefs: Array<RemotePluginModuleOptions>
  ): Promise<Array<PluginModuleInterface>> {
    const ret = new Array<PluginModuleInterface>();
    for (const moduleDef of moduleDefs) {
      try {
        const loaded = await this.loadModule(moduleDef);
        ret.push(loaded);
      } catch (error) {
        console.error(
          'Error loading plugin ' +
            moduleDef.moduleId +
            ' from ' +
            moduleDef.remoteEntry,
          error
        );
      }
    }
    return ret;
  }
}
