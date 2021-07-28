import {InjectionToken} from "@angular/core";

export interface SandboxLibConfig {
  webSocketUrl: string;
}

export const SANDBOX_CONFIG = new InjectionToken<SandboxLibConfig>('SandboxLibConfig');
