import {
  Action,
  ActionHandler,
  Change,
  CommandProviderInterface,
  DontCodeModelPointer,
  PreviewHandler
} from "@dontcode/core";
import {Subscription} from "rxjs";
import {PluginHandlerHelper} from "./plugin-handler-helper";

/**
 * Helps develop a plugin handler that is not an Angular Component. For an Angular Component handling model changes, please use PluginBaseComponent
 */
export abstract class AbstractPluginHandler implements PreviewHandler, ActionHandler {
  protected subscriptions = new Subscription();
  protected pluginHelper = new PluginHandlerHelper();
  protected entityPointer: DontCodeModelPointer | null = null
  protected provider: CommandProviderInterface | null = null;

  protected unsubscribe(): void {
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
   * @param target
   * @param targetMap
   * @param change
   * @param property
   * @param transform
   * @param parentPosition
   * @param applyProperty
   * @private
   */
  applyUpdatesToArrayAsync<T>(target: T[], targetMap: Map<string, number>, change: Change, property: string|null, transform: (position: DontCodeModelPointer, item: any) => Promise<T>,
                              parentPosition?: string, applyProperty?: (target: T, key: string|null, value: any) => boolean): Promise<T[]> {
    return this.pluginHelper.applyUpdatesToArrayAsync(target, targetMap, change, property, transform, parentPosition, applyProperty);
  }

  /**
   * This is where components react to changes received
   * @param change
   * @protected
   */
  abstract handleChange(change: Change): void;

  /**
   * Called whenever an action needs to be performed on the data
   * @param action
   */
  performAction(action: Action): Promise<void> {
    return Promise.resolve(undefined);
  }

}
