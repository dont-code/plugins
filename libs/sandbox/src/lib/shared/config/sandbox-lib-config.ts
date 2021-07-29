import {InjectionToken} from "@angular/core";

export interface SandboxLibConfig {
  webSocketUrl?: string;
  indexedDbName?: string;
}

export const SANDBOX_CONFIG = new InjectionToken<SandboxLibConfig>('SandboxLibConfig');
