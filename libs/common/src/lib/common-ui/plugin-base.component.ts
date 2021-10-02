import {Component, Injector, OnDestroy} from "@angular/core";
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {ComponentLoaderService} from "../common-dynamic/component-loader.service";
import {AbstractDynamicLoaderComponent} from "./abstract-dynamic-loader-component";
import {PluginHandlerHelper} from "../common-handler/plugin-handler-helper";
import {Subscription} from "rxjs";

/**
 * A component that can be loaded by the framework, load subcomponents, listen to model changes, and so on...
 * Usually provided by plugins and run by the framework
 */
@Component({template: ''})
export abstract class PluginBaseComponent extends AbstractDynamicLoaderComponent implements PreviewHandler, OnDestroy {
  protected subscriptions = new Subscription();
  protected pluginHelper = new PluginHandlerHelper();
  entityPointer: DontCodeModelPointer | null = null
  protected provider: CommandProviderInterface | null = null;

  constructor(loader: ComponentLoaderService, injector:Injector) {
    super(loader, injector);
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe();
  }

  protected forceUnsubscribe(): void {
    this.pluginHelper.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    this.entityPointer = pointer;
    this.provider = provider;
    this.pluginHelper.initCommandFlow(provider, pointer, this);
  }

  protected initChangeListening() {
    this.pluginHelper.initChangeListening();
  }

  /**
   * When the component is created for display, it receives the initial data as complete Json.
   * If it wants, it can call this method who will call handleChange for each property.
   * This will avoid to duplicate code (first time when a complete json is sent, second when subelements are sent)
   * @protected
   */
  protected decomposeJsonToMultipleChanges(pointer: DontCodeModelPointer, json: any): void {
    this.pluginHelper.decomposeJsonToMultipleChanges(pointer, json);
  }

  /**
   * Retrieve the value of the key property if the change concerns it
   * @param change
   * @param key
   */
  decodeStringField(change: Change, key: string): string|undefined {
    if (change.pointer?.key === key) {
      return change.value;
    } else
      return undefined;
  }

  /**
   * Updates the array of T elements by applying the changes received and calling the transform method
   * @param cols
   * @param colsMap
   * @param change
   * @param property
   * @param transform
   * @private
   */
  applyUpdatesToArray<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string, transform: (position: DontCodeModelPointer, item: any) => T, applyProperty?: (target: T, key: string, value: any) => boolean): Promise<T[]> {
    return this.applyUpdatesToArrayAsync(target, targetMap, change, property, (key, item) => {
      return Promise.resolve( transform(key, item));
    } );
  }

  /**
   * Updates the array of T elements by applying the changes received and calling the transform method
   * @param cols
   * @param colsMap
   * @param change
   * @param property
   * @param transform
   * @private
   */
  applyUpdatesToArrayAsync<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string|null, transform: (position: DontCodeModelPointer, item: any) => Promise<T>, applyProperty?: (target: T, key: string|null, value: any) => boolean): Promise<T[]> {
    return this.pluginHelper.applyUpdatesToArrayAsync(target, targetMap, change, property, transform, applyProperty);
  }

    /**
   * This is where components react to changes received
   * @param change
   * @protected
   */
  handleChange(change: Change) {

  }

}
