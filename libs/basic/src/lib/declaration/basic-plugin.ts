import { DontCode, DontCodeModel } from "@dontcode/core";
import Plugin = DontCode.Plugin;

export class BasicPlugin implements Plugin
{
  getConfiguration(): DontCode.PluginConfig {
    return {
      "plugin": {
        "id": "BasicPlugin",
        "display-name": "Dont code plugin for all base elements",
        "version": "1.0.0"
      },
      "schema-updates": [{
        "id": "entity-all",
        "description": "Screens to directly list, edit, remove entities",
        "changes": [{
          "location": {
            "parent": "#/definitions/entity"
          },
          "replace": false
        }]
      }],
      "preview-handlers": [
        {
          location: {
            parent: DontCodeModel.APP_ENTITIES
          },
          class: {
            name:"BasicEntityComponent",
            source:"basic"
          }
        }
      ]
    }
  }

}
