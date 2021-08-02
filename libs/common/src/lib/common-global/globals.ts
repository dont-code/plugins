import {InjectionToken} from "@angular/core";
import {CommandProviderInterface} from "@dontcode/core";

export let COMMAND_PROVIDER = new InjectionToken<CommandProviderInterface>('Inject the current command provider interface');

