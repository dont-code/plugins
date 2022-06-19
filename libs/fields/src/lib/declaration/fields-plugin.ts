import {Plugin, DontCodeModel, PluginConfig, Core} from '@dontcode/core';

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
            parent: '#/$defs/field',
            id: 'type'
          },
          update: {
            enum: [{
              Social: {
                enum: [
                  'Rating'
                  ]
              }
            }
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
            values: [{
              Social: {
                enum: [
                  'Rating'
                ]
              }
            }]
          },
          class: {
            name:'RatingComponent',
            source:'fields'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              International: {
                enum: [
                  'Country'
                ]
              }
            }]
          },
          class: {
            name:'CountryComponent',
            source:'fields'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              International: {
                enum: [
                  'Currency'
                ]
              }
            }]
          },
          class: {
            name:'CurrencyComponent',
            source:'fields'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              Money: {
                enum: [
                  'Euro',
                  'Dollar'
                ]
              }
            }]
          },
          class: {
            name:'EuroDollarComponent',
            source:'fields'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              Money: {
                enum: [
                  'Other currency'
                ]
              }
            }]
          },
          class: {
            name:'MoneyComponent',
            source:'fields'
          }
        }

      ]
    }
  }

  pluginInit(dontCode: Core): void {
    // Nothing to do here
  }

}
