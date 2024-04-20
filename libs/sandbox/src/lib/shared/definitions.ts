import { RepositorySchema } from "@dontcode/core";

export interface SandboxRepositorySchema extends RepositorySchema {
    webSocketUrl?: string,
    ideWebSocketUrl?:string,
    storeApiUrl?: string,
    projectApiUrl?: string,
    documentApiUrl?: string,
  }
  
