import {InjectionToken} from "@angular/core";
import {CommandProviderInterface, Core} from "@dontcode/core";
import { CommonLibConfig } from "../common-config/common-lib-config";

export let COMMAND_PROVIDER = new InjectionToken<CommandProviderInterface>('Inject the current command provider interface');

/**
 * Enable the Dont-code Core interface to be injected
 */
export const DONT_CODE_CORE=new InjectionToken<Core>("Dont-code core object");

/**
 * Enable the injection of config parameters
 */
export const DONT_CODE_COMMON_CONFIG = new InjectionToken<CommonLibConfig>('DontCodeCommonLibConfig');

/**
 * Enable the application to provide the url of the API for managing the data (used by basic plugin)
 */
export const DONT_CODE_STORE_API_URL = new InjectionToken<string>('DontCodeStoreApiUrl');
/**
 * Enable the application to provide the url of the API for managing documents (used by image plugin)
 */
export const DONT_CODE_DOC_API_URL = new InjectionToken<string>('DontCodeStoreDocUrl');

