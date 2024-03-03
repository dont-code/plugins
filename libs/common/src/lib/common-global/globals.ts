import {InjectionToken} from "@angular/core";
import {CommandProviderInterface, Core} from "@dontcode/core";
import { CommonLibConfig } from "../common-config/common-lib-config";

export let COMMAND_PROVIDER = new InjectionToken<CommandProviderInterface>('Inject the current command provider interface');

/**
 * Enable the Dont-code Core interface to be injected
 */
export const DONT_CODE_CORE=new InjectionToken<Core>("Dont-code core object");

/**
 * Enable the injection of static config parameters (internal use only)
 */
export const DONT_CODE_COMMON_CONFIG = new InjectionToken<CommonLibConfig>('DontCodeCommonLibConfig');
