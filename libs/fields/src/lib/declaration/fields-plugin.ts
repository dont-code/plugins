import {Plugin, DontCodeModel, PluginConfig} from '@dontcode/core';

export class FieldsPlugin implements Plugin
{
  getConfiguration(): PluginConfig {
    return {
      plugin: {
        id: 'FieldsPlugin',
        'display-name': 'Dont code plugin for specific fields like country, currency',
        version: '1.0.0'
      },
      'schema-updates': [{
        id: 'country-type',
        description: 'Add Country as a type of field',
        changes: [{
          location: {
            parent: '#/definitions/field',
            id: 'type'
          },
          add: {
            enum: [
              'Country'
            ]
          },
          replace: false
        }]
      }],
      'preview-handlers': [
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: ['Country']
          },
          class: {
            name:'CountryComponent',
            source:'fields'
          }
        }
      ]
    }
  }

}
