import { RepositorySchema } from "@dontcode/core";

export interface SandboxRepositorySchema extends RepositorySchema {
    webSocketUrl?: string,
    storeApiUrl?: string,
    projectApiUrl?: string,
    documentApiUrl?: string,
  }
  
