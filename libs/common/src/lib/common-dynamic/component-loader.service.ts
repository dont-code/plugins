import {
  createNgModuleRef,
  getNgModuleById,
  Inject,
  Injectable,
  Injector,
  NgModuleRef,
  Optional,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {
  ChangeHandlerConfig,
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodePreviewManager,
  dtcde,
  PluginModuleInterface,
  PreviewHandler,
} from '@dontcode/core';
import {DynamicComponent} from '../common-ui/dynamic-component';
import {COMMAND_PROVIDER} from '../common-global/globals';
import {Mutex} from 'async-mutex';

/**
 * Manages the dynamic loading of components able to display a data located at a specific pointer position
 * Depending on the plugins loaded, a different component can display the same value.
 *
 * It keeps in cache as well the component factory and module used for a pointer position
 */
@Injectable({
  providedIn: 'root',
})
export class ComponentLoaderService {
  protected previewMgr: DontCodePreviewManager;

  protected moduleMap = new Map<string, NgModuleRef<PluginModuleInterface>>();
  mutex = new Mutex();

  constructor(
    protected injector: Injector,
    @Optional()
    @Inject(COMMAND_PROVIDER)
    protected provider?: CommandProviderInterface
  ) {
    this.previewMgr = dtcde.getPreviewManager();
  }

  loadPluginModule(
    handlerConfig: ChangeHandlerConfig
  ): Promise<NgModuleRef<PluginModuleInterface>> {
    return this.mutex.acquire().then((release) => {
      try {
        let moduleRef = this.moduleMap.get(handlerConfig.class.source);
        if (!moduleRef) {
          moduleRef = createNgModuleRef(
              getNgModuleById ('dontcode-plugin/' + handlerConfig.class.source),
            this.injector);
          if (moduleRef)
            this.moduleMap.set(handlerConfig.class.source, moduleRef);
        }
        return moduleRef;
      } finally {
        release();
      }
    });
  }

  insertComponentForFieldType (type: string,
                               insertPoint: ViewContainerRef
  ) {
    return this.insertComponent('creation/entities/fields/type', insertPoint, type);
  }

  insertComponent(
    schemaPosition: DontCodeModelPointer | string,
    insertPoint: ViewContainerRef,
    currentJson?: any
  ): Promise<DynamicComponent | null> {
    let schemaPos: string = (schemaPosition as DontCodeModelPointer)
      .positionInSchema;
    let isPointer: boolean;
    if (schemaPos) {
      isPointer = true;
      if (!currentJson) {
        currentJson = this.provider?.getJsonAt(
          (schemaPosition as DontCodeModelPointer).position
        );
      }
    } else {
      isPointer=false;
      schemaPos = schemaPosition as string;
    }

    const handlerConfig = this.previewMgr.retrieveHandlerConfig(
      schemaPos,
      currentJson
    );

    if (handlerConfig) {
      console.debug('Importing from ', handlerConfig.class.source);
      // First lets try if the plugin is imported during the compilation

      return this.loadPluginModule(handlerConfig)
        .then((moduleRef) => {
          const componentClass = moduleRef.instance
            .exposedPreviewHandlers()
            .get(handlerConfig.class.name);

          return this.createComponent(componentClass, insertPoint, moduleRef, isPointer?schemaPosition as DontCodeModelPointer:null);
        })
        .catch((reason) => {
          return Promise.reject(
            'Cannot load module for source ' +
              handlerConfig.class.source +
              ' because of ' +
              reason
          );
        });
      //console.log ("Applying component");
    } else {
      return Promise.resolve(null);
    }
  }

  createComponent(
    componentClass: Type<DynamicComponent>,
    insertPoint: ViewContainerRef,
    moduleRef: NgModuleRef<PluginModuleInterface> | undefined,
    position: DontCodeModelPointer | null
  ): DynamicComponent {
    let injector = this.injector;
    const componentRef = insertPoint.createComponent(
      componentClass, {
      injector:injector,
      ngModuleRef: moduleRef
      }
    );
    const component = componentRef.instance as DynamicComponent;

    if ((component as unknown as PreviewHandler).initCommandFlow) {
      // It's a previewHandler
      if (!position)
        throw new Error(
          'Component ' +
            component.constructor.name +
            ' is a PreviewHandler and parent position is missing.'
        );
      if (!this.provider)
        throw new Error(
          'Component ' +
            component.constructor.name +
            ' is a PreviewHandler and CommandProviderInterface is missing.'
        );
      (component as unknown as PreviewHandler).initCommandFlow(
        this.provider,
        position
      );
    }
    return component;
  }
}
