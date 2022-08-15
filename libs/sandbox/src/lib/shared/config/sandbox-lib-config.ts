import {Inject, InjectionToken, Optional} from "@angular/core";

export interface SandboxLibConfig {
  webSocketUrl?: string;
  projectUrl?: string;
  storeUrl?:string;
  documentUrl?:string;
  indexedDbName?: string;
  applicationName?: string;
  theme?: string;
  templateFileUrl?: string;
}

export const SANDBOX_CONFIG = new InjectionToken<SandboxLibConfig>('SandboxLibConfig');

export const basicStoreApiUrlConfig = (config:SandboxLibConfig) => {
  return config.storeUrl;
};

export const basicDocumentApiUrlConfig = (config:SandboxLibConfig) => {
  return config.documentUrl;
};

export const CHANNEL_CHANGE_NAME='preview-ui-changes';
