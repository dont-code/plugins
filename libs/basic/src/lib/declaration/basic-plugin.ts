import {Plugin, DontCodeModel, PluginConfig} from "@dontcode/core";

export class BasicPlugin implements Plugin
{
  getConfiguration(): PluginConfig {
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
      },
        {
          "id": "dont-code-storage",
          "description": "Stores application data in Dont-code project storage",
          "changes": [{
            "location": {
              "parent": "#/definitions/sharing",
              "id":"with"
            },
            "replace": false,
            "add": {
              "enum": [
                "Dont-code users"
              ]
            }
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
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: ['string', 'number', 'boolean']
          },
          class: {
            name:'BasicFieldsComponent',
            source:'basic'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_SHARING,
            id: 'with',
            values: ['Dont-code users']
          },
          class: {
            name:'BasicFieldsComponent',
            source:'basic'
          }
        }
      ]
    }
  }

}
