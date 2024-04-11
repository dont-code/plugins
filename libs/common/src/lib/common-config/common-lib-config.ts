import {Inject, InjectionToken, Optional} from "@angular/core";
import {MenuItem} from "primeng/api";

export interface CommonLibConfig {
  webSocketUrl?: string;
  ideWebSocketUrl?: string;
  projectApiUrl?: string;
  storeApiUrl?:string;
  documentApiUrl?:string;
  indexedDbName?: string;
  applicationName?: string;
  theme?: string;
  templateFileUrl?: string;
}


/*export const basicStoreApiUrlConfig = (config:CommonLibConfig) => {
  return config.storeUrl;
};

export const basicDocumentApiUrlConfig = (config:CommonLibConfig) => {
  return config.documentUrl;
};*/

export const CHANNEL_CHANGE_NAME='preview-ui-changes';

/**
 * Allows application to add any menu
 */
export interface MenuUpdater {
  additionalMenus (): MenuItem[];
}

export const SANDBOX_MENUS = new InjectionToken<MenuUpdater>('Allows addition of menus');
