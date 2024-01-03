import { Inject, Injectable } from "@angular/core";
import { CommonLibConfig } from "./common-lib-config";
import { Observable, Subject } from "rxjs";
import { DONT_CODE_COMMON_CONFIG } from "../common-global/globals";

/**
 * A service storing configuration information.
 * Configuration can be changed after loading
 */
@Injectable({
    providedIn: 'root',
  })
  export class CommonConfigService {
      protected config: CommonLibConfig;
      protected updates = new Subject<Readonly<CommonLibConfig>> ();

      constructor (@Inject(DONT_CODE_COMMON_CONFIG) config: CommonLibConfig) {
        this.config = config;
      }

      getConfig (): Readonly<CommonLibConfig> {
        return this.config;
      }
      getUpdates (): Observable<Readonly<CommonLibConfig>> {
        return this.updates;
      }
      
      updateConfig (property:keyof CommonLibConfig, value:any) {
        this.config[property]=value;
        this.updates.next (this.config);
      }
  }  