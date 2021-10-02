import {Change, ChangeType, CommandProviderInterface, DontCodeModelPointer, PreviewHandler} from "@dontcode/core";
import {map} from "rxjs/operators";
import {from, Observable, of, Subscription} from "rxjs";
import {PluginHandlerHelper} from "./plugin-handler-helper";

/**
 * Helps develop a plugin handler that is not an Angular Component. For an Angular Component handling model changes, please use PluginBaseComponent
 */
export class AbstractPluginHandler implements PreviewHandler {
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
    this.pluginHelper.initCommandFlow(provider, pointer, this.handleChange);
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
   * Calls handleChange each time a change event for any element below this (as per the model's position) is received
   * @protected
   */

  /**
   * This is where components react to changes received
   * @param change
   * @protected
   */
  protected handleChange(change: Change) {

  }


}
