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
   * @param repoUrl: the url to load the repository config from. If undefined, nothing gets loaded, if null, the defaultRepoUrl will be used instead
   */
  loadPluginsFromRepository (repository?:RepositorySchema, repoUrl?:string) : Promise<RepositorySchema>{
    if (repository===undefined) return Promise.resolve({name:"No Repository", plugins:[]});
    // eslint-disable-next-line no-restricted-syntax
    console.debug("Loading plugins");
    return new Promise ( (resolve, reject) => {
      try {
        this.repository = repository;
        if (this.repository?.plugins != null) {
          const toLoad=new Array<RemotePluginModuleOptions>();
          for (const value of this.repository.plugins) {
            toLoad.push(this.createRemotePluginConfig (value, repoUrl));
          }
          // eslint-disable-next-line no-restricted-syntax
          console.debug("Loading following plugins", this.repository.plugins);
          this.loadMultipleModules(toLoad).then ( () => {
            if( this.repository!=null)
            resolve (this.repository);
            else {
              reject("No repository loaded");
            }
      
          }).catch (reason => {
            reject(reason);
          });
        }
      } catch(reason) {
          console.error("Cannot load repository config from "+repoUrl+" due to error ", reason);
          return reject(reason);
        }
      });
  }

  protected createRemotePluginConfig(value: RepositoryPluginEntry, defaultRepoUrl?:string): RemotePluginModuleOptions {
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
    await loadRemoteModule(moduleDef);
    const mainModule = await this.compLoader.getOrCreatePluginModuleRef(moduleDef.moduleId.toLowerCase());
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
            moduleDef.moduleId,
          error
        );
      }
    }
    return ret;
  }
}
