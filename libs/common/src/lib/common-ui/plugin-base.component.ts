import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Change, CommandProviderInterface, DontCodeModelPointer } from "@dontcode/core";

@Component({template:''})
export abstract class PluginBaseComponent implements OnInit, OnDestroy {
  protected subscriptions = new Subscription();
  entityPointer:DontCodeModelPointer;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe();
  }

  protected forceUnsubscribe(): void {
    this.subscriptions.unsubscribe();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    this.entityPointer = pointer;
  }


    decodeStringField(change: Change, key: string): string {
    if (change.pointer.key === key) {
      return change.value;
    } else
      return undefined;
  }

  /**
   * Updates a map of items (stored as a json object)
   * @param change
   * @param currentMap: The current list of objects to modify
   * @param key
   */
  decodeMapField(change: Change, currentMap:any, key: string): any {
    if (change.pointer.calculateKeyOrContainer() === key) {
      let id=change.pointer.itemId;

      let ret= { };
      let found=false;

      if( currentMap) {
        Object.keys(currentMap).forEach(curKey => {
              // If no keys are given, use the change position to detect updates vs add
          if (curKey === id) {
            ret[curKey]=change.value;
            found = true;
          } else {
            ret[curKey]=currentMap[curKey];
          }
        });
      }

      if(!found)
        ret[id]=change.value;

      return ret;
    } else
      return undefined;
  }

}
