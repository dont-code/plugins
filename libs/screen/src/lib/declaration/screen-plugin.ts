import { DontCode } from "@dontcode/core";
import Plugin = DontCode.Plugin;

export class ScreenPlugin implements Plugin
{
  getConfiguration(): DontCode.PluginConfig {
    return {
      "plugin": {
        "id": "ScreenPlugin",
        "display-name": "Dont code test Plugin adding screen types",
        "version": "1.0.0"
      },
      "schema-updates": [{
        "id": "screen-list",
        "description": "A screen displaying a list of items",
        "changes": [{
          "location": {
            "parent": "#/definitions/screen",
            "id": "type",
            "after": "name"
          },
          "add": {
            "enum": [
              "list"
            ]
          },
          "props": {
            "entity": {
              "type": "string",
              "format": "#/creation/entities"
            }
          },
          "replace": true
        }, {
          "location": {
            "parent": "/definitions/screen",
            "id": "type",
            "after": "name"
          },
          "add": {
            "enum": [
              "freeform"
            ]
          },
          "props": {},
          "replace": false
        }]
      }]
    }
  }

}
