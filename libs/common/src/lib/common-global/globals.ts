import {InjectionToken} from "@angular/core";
import {CommandProviderInterface, Core} from "@dontcode/core";

export let COMMAND_PROVIDER = new InjectionToken<CommandProviderInterface>('Inject the current command provider interface');

/**
 * Enable the Dont-code Core interface to be injected
 */
export const DONT_CODE_CORE=new InjectionToken<Core>("Dont-code core object");
