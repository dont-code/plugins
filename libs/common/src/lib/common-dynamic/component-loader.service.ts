import {
  ComponentFactory,
  ComponentFactoryResolver,
  getModuleFactory, Inject,
  Injectable,
  Injector, Type,
  ViewContainerRef
} from '@angular/core';
import {
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodePreviewManager,
  dtcde,
  PluginModuleInterface, PreviewHandler
} from '@dontcode/core';
import {DynamicComponent} from "../common-ui/dynamic-component";
import {COMMAND_PROVIDER} from "../common-global/globals";

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
  protected factoryMap = new Map<{ source:string, name:string }, ComponentFactory<DynamicComponent>>();

  constructor(protected componentFactoryResolver: ComponentFactoryResolver, protected injector:Injector, @Inject(COMMAND_PROVIDER) protected provider?:CommandProviderInterface) {
    this.previewMgr = dtcde.getPreviewManager();
  }

  loadComponentFactoryForFieldType(type: string): Promise<ComponentFactory<DynamicComponent>|null> {
    return this.loadComponentFactory('creation/entities/fields/type', type);
  }

  loadComponentFactory(schemaPosition: DontCodeModelPointer | string, currentJson?: any): Promise<ComponentFactory<DynamicComponent>|null> {
    let schemaPos:string = (schemaPosition as DontCodeModelPointer).schemaPosition;
    if (schemaPos) {
      if (!currentJson) {
        currentJson = this.provider?.getJsonAt((schemaPosition as DontCodeModelPointer).position);
      }
    } else {
      schemaPos = schemaPosition as string;
    }

    const handlerConfig = this.previewMgr.retrieveHandlerConfig(schemaPos, currentJson);

    if (handlerConfig) {
      console.log("Importing from ", handlerConfig.class.source);
      // First lets try if the plugin is imported during the compilation

      let module = this.moduleMap.get(handlerConfig.class.source);
      if (!module) {
        module = getModuleFactory('dontcode-plugin/' + handlerConfig.class.source).create(this.injector).instance;
        if( !module)
          return Promise.reject("Cannot load module for source "+handlerConfig.class.source)
        this.moduleMap.set(handlerConfig.class.source, module);
      }
      //console.log ("Applying component");
      let componentFactory = this.factoryMap.get(handlerConfig.class) || null;
      if (!componentFactory) {
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(module.exposedPreviewHandlers().get(handlerConfig.class.name)) as ComponentFactory<DynamicComponent>;
        this.factoryMap.set(handlerConfig.class, componentFactory);
      }
      return Promise.resolve(componentFactory);
    } else {
      return Promise.resolve(null);
    }

  }

  createGivenComponent (componentClass: Type<DynamicComponent>, insertPoint:ViewContainerRef, position: DontCodeModelPointer|null) : DynamicComponent {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass) as ComponentFactory<DynamicComponent>;
    if (!componentFactory)
      throw new Error ("Cannot find ComponentFactory for Component class "+componentClass.name);
    return this.createComponent(componentFactory, insertPoint, position);
  }

  createComponent (factory: ComponentFactory<DynamicComponent>, insertPoint:ViewContainerRef, position: DontCodeModelPointer|null) : DynamicComponent{
    const componentRef = insertPoint.createComponent(factory, undefined, this.injector);
    const component = componentRef.instance as DynamicComponent;

    if ((component as unknown as PreviewHandler).initCommandFlow)    // It's a previewHandler
    {
      if (!position)  throw new Error("Component "+component.constructor.name+" is a PreviewHandler and parent position is missing.");
      if (!this.provider)  throw new Error("Component "+component.constructor.name+" is a PreviewHandler and CommandProviderInterface is missing.");
      (component as unknown as PreviewHandler).initCommandFlow (this.provider, position);
    }
  return component;
  }

}
