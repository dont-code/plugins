import {Plugin, DontCodeModel, PluginConfig, Core} from "@dontcode/core";

export class BasicPlugin implements Plugin {
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
            "parent": "#/$defs",
            "id":"entity"
          },
          "replace": false
        }]
      },
        {
          "id": "dont-code-storage",
          "description": "Stores application data in Dont-code project storage",
          "changes": [{
            "location": {
              "parent": "#/$defs/sharing",
              "id":"with"
            },
            "replace": false,
            "update": {
              "enum": [
                "Dont-code users"
              ]
            }
          }]
        }],
      "preview-handlers": [
        {
          location: {
            parent: DontCodeModel.APP_ENTITIES,
            id:''
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
            values: ['String', 'Number', 'Boolean']
          },
          class: {
            name:'BasicFieldsComponent',
            source:'basic'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: ['Date', 'Date & Time', 'Time']
          },
          class: {
            name:'TimeFieldsComponent',
            source:'basic'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: ['Website (url)', 'Image']
          },
          class: {
            name:'WebFieldsComponent',
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
            name:'DontCodeApiStoreProvider',
            source:'basic'
          }
        }
      ]
    }
  }

  pluginInit(dontCode: Core): void {
    // Nothing to do here
  }

}
