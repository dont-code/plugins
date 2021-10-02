import {Plugin, DontCodeModel, PluginConfig} from "@dontcode/core";

export class ScreenPlugin implements Plugin
{
  getConfiguration(): PluginConfig {
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
          "update": {
            "enum": [
              "list"
            ]
          },
          "props": {
            "entity": {
              "type": "string",
              "format": "$.creation.entities[*]"
            }
          },
          "replace": true
        }, {
          "location": {
            "parent": "/definitions/screen",
            "id": "type",
            "after": "name"
          },
          "update": {
            "enum": [
              "freeform"
            ]
          },
          "props": {},
          "replace": false
        }]
      }],
      "preview-handlers": [
        {
          location: {
            parent: DontCodeModel.APP_SCREENS,
            id:"type",
            values:[
              "list"
            ]
          },
          class: {
            name:"ScreenComponent",
            source:"screen"
          }
        }
      ]
    }
  }

}
