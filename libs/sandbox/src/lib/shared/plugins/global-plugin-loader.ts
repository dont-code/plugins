import {DontCodePreviewManager, PreviewHandler,} from '@dontcode/core';
import {Subscriber} from 'rxjs';
import {Injectable, Type} from '@angular/core';
import {ComponentLoaderService} from '@dontcode/plugin-common';
import {ChangeProviderService} from '../command/services/change-provider.service';
import {map, mergeMap} from 'rxjs/operators';

/**
 * Loads all plugins that are declared globally
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalPluginLoader {
  protected subscribers = new Subscriber();
  //  protected handlersPerPosition = new Map<string, PreviewHandler> ();  // Keep instances created late
  protected cachedHandlers = new Map<Type<PreviewHandler>, PreviewHandler>();

  constructor(
    protected loader: ComponentLoaderService,
    protected changeService: ChangeProviderService,
    protected previewManager:DontCodePreviewManager
  ) {}

  /**
   * Register each global handler to the changeService: It will create and call them when necessary
   * @param previewManager
   */
  initLoading() {
    this.subscribers.add(
      this.previewManager
        .receiveGlobalHandlers()
        .pipe(
          mergeMap((config) => {
            return this.loader.loadPluginModule(config).then((moduleRef) => {
              return { config, moduleRef };
            });
          }),
          mergeMap((result) => {
            const clazz: Type<PreviewHandler> = result.moduleRef.instance
              .exposedPreviewHandlers()
              .get(result.config.class.name);
            //          console.log('ReceiveCommands');
            return this.changeService
              .receiveCommands(
                result.config.location.parent,
                result.config.location.id
              )
              .pipe(
                map((change) => {
                  return { clazz, moduleRef: result.moduleRef, change };
                })
              );
          }),
          map((project) => {
            let handler = this.cachedHandlers.get(project.clazz);
            if (!handler) {
              //cache instance per config and use it first to avoid multiple instances creation

              handler = project.moduleRef.injector.get(project.clazz);
              this.cachedHandlers.set(project.clazz, handler);
              handler.initCommandFlow(
                this.changeService,
                project.change.pointer ??
                  this.changeService.calculatePointerFor(
                    project.change.position
                  )
              );
              handler.handleChange(project.change);
            }
            return handler;
          })
        )
        .subscribe({
          error: (error) => {
            console.error('Error loading global handler', error);
          },
        })
    );
  }

  close(): void {
    this.subscribers.unsubscribe();
  }
}
