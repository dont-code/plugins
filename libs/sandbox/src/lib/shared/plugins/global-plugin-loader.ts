import {ChangeHandlerConfig, DontCodePreviewManager, PreviewHandler} from "@dontcode/core";
import {Subscriber, throwError} from "rxjs";
import {Injectable, Type} from "@angular/core";
import {ComponentLoaderService} from "@dontcode/plugin-common";
import {ChangeProviderService} from "../command/services/change-provider.service";
import {map, mergeMap} from "rxjs/operators";

/**
 * Loads all plugins that are declared globally
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalPluginLoader {
  protected subscribers = new Subscriber();
//  protected handlersPerPosition = new Map<string, PreviewHandler> ();  // Keep instances created late
  protected cachedHandlers = new Map<Type<PreviewHandler>, PreviewHandler>();

  constructor(protected loader:ComponentLoaderService, protected changeService:ChangeProviderService) {
  }

  /**
   * Register each global handler to the changeService: It will create and call them when necessary
   * @param previewManager
   */
  initLoading (previewManager: DontCodePreviewManager) {
    this.subscribers.add(
      previewManager.receiveGlobalHandlers().pipe (
        mergeMap (config => {
          const moduleRef = this.loader.loadPluginModule(config);
          if( !moduleRef)
            throwError(new Error ('Cannot find module for '+config.class.name));
          const clazz: Type<PreviewHandler> = moduleRef.instance.exposedPreviewHandlers().get(config.class.name);
          return this.changeService.receiveCommands(config.location.parent, config.location.id).pipe(map(change => {
            return {clazz,moduleRef,change}
          }));
        }),
        map ( project => {


          let handler = this.cachedHandlers.get(project.clazz);
          if( !handler) {
            //cache instance per config and use it first to avoid multiple instances creation

            handler = project.moduleRef.injector.get(project.clazz);
            this.cachedHandlers.set(project.clazz, handler);
            handler.initCommandFlow(this.changeService, project.change.pointer??this.changeService.calculatePointerFor(project.change.position));
            handler.handleChange(project.change);
          }
          return handler;

        })
      ).subscribe({
        error: (error) => {
          console.log("Error loading global handler", error);
        }
      }));

  }

  close (): void {
    this.subscribers.unsubscribe();
  }
}
