import {createNgModuleRef, Injectable, Injector} from '@angular/core';
import {loadRemoteModule, LoadRemoteModuleOptions,} from '@angular-architects/module-federation-runtime';
import {PluginModuleInterface} from '@dontcode/core';

export type RemotePluginModuleOptions = LoadRemoteModuleOptions & {
  moduleName: string;
};

/**
 * Loads any plugins remotely as defined per the configuration
 */
@Injectable({
  providedIn: 'root',
})
export class RemotePluginLoaderService {
  constructor(protected injector: Injector) {}

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
    const mainModuleClass = module[moduleDef.moduleName];
    if (mainModuleClass==null)  // The main module class is not defined
    {
      throw new Error("ModuleClass "+moduleDef.moduleName+" not exported in "+moduleDef.remoteEntry);
    }
    const mainModule = createNgModuleRef<PluginModuleInterface>(mainModuleClass, this.injector).instance;
    /*const mainModule = this.compiler
      .compileModuleSync(mainModuleClass)
      .create(this.injector).instance as PluginModuleInterface;*/
    return mainModule;
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
        console.log(
          'Error loading plugin ' +
            moduleDef.moduleName +
            ' from ' +
            moduleDef.remoteEntry,
          error
        );
      }
    }
    return ret;
  }
}
