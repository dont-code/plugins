import {InjectionToken} from "@angular/core";

export interface SandboxLibConfig {
  webSocketUrl?: string;
  indexedDbName?: string;
  applicationName?: string;
  theme?: string;
}

export const SANDBOX_CONFIG = new InjectionToken<SandboxLibConfig>('SandboxLibConfig');
