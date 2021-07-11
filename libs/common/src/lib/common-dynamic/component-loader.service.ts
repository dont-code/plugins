import {ComponentFactory, ComponentFactoryResolver, getModuleFactory, Injectable} from '@angular/core';
import {DontCodeModelPointer, DontCodePreviewManager, dtcde, PluginModuleInterface} from '@dontcode/core';
import {DynamicComponent} from "../common-ui/dynamic-component";

/**
 * Manages the dynamic loading of components able to display a data located at a specific pointer position
 * Depending on the plugins loaded, a different component can display the same value.
 *
 * It keeps in cache as well the component factory and module used for a pointer position
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {

  protected previewMgr:DontCodePreviewManager;

  protected moduleMap = new Map<string, PluginModuleInterface>();
  protected factoryMap = new Map<{ source, name }, ComponentFactory<DynamicComponent>>();

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {
    this.previewMgr = dtcde.getPreviewManager();
  }

  loadComponentForFieldType(type: string): Promise<ComponentFactory<DynamicComponent>> {
    return this.loadComponentFactory('creation/entities/fields/type', type);
  }

  loadComponentFactory(schemaPosition: DontCodeModelPointer | string, currentJson?: any): Promise<ComponentFactory<DynamicComponent>> {
    let schemaPos:string = (schemaPosition as DontCodeModelPointer).schemaPosition;
    if (!schemaPos) schemaPos = schemaPosition as string;

    const handlerConfig = this.previewMgr.retrieveHandlerConfig(schemaPos, currentJson);

    if (handlerConfig) {
      console.log("Importing from ", handlerConfig.class.source);
      // First lets try if the plugin is imported during the compilation

      let module = this.moduleMap.get(handlerConfig.class.source);
      if (!module) {
        module = getModuleFactory('dontcode-plugin/' + handlerConfig.class.source).create(null).instance;
        this.moduleMap.set(handlerConfig.class.source, module);
      }
      //console.log ("Applying component");
      let componentFactory = this.factoryMap.get(handlerConfig.class);
      if (!componentFactory) {
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(module.exposedPreviewHandlers().get(handlerConfig.class.name)) as ComponentFactory<DynamicComponent>;
        this.factoryMap.set(handlerConfig.class, componentFactory);
      }
      return Promise.resolve(componentFactory);
    } else {
      return Promise.resolve(null);
    }

  }

}
