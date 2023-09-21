import {ChangeHandlerConfig, Core, DontCodeModel, dtcde, Plugin, PluginConfig} from "@dontcode/core";
import {ComponentLoaderService} from "../common-dynamic/component-loader.service";
import {PluginCommonTestModule} from "../plugin-common-test.module";

/**
 * In complement of DontCodeTestManager, provides some Angular specific helpers
 */
export class CommonTestManager {

  /**
   * Register a specific component for testing
   * @param type
   * @param component
   * @param cls
   */
  public static registerComponentForType(forType: string, name: string, component: any) {

    // Add the config so that ComponentLoaderService finds the component
    dtcde.registerPlugin(new TestPlugin({forType, name}));
    PluginCommonTestModule.previewHandlers.set(name, component);
  }
}

class TestPlugin implements Plugin {

  protected testComponents :{forType:string, name:string}|null=null;


  constructor(toDeclare:{forType:string, name:string}) {
    this.testComponents=toDeclare;
  }

  CONFIG: PluginConfig={
    plugin: {
      id:'CommonTestManagerPlugin',
      version:'1.0'
    },
    'schema-updates': [{
      id: 'test-component',
      description: 'Test Component added',
      changes: [{
        location: {
          parent: '#/$defs/field',
          id: 'type'
        },
        update: {
          enum: [{
            Test: {
              enum: [
              ]
            }
          }
          ]
        },
        replace: false
      }]
    }],

    "preview-handlers": []
  }

  PREVIEW_HANDLER_CONFIG: ChangeHandlerConfig={
    location: {
      parent: DontCodeModel.APP_FIELDS,
      id: 'type',
      values: [{
        Test: {
          enum: [
          ]
        }
      }]
    },
    class: {
      source:'common-test-module',
      name:'name'
    }
  };

getConfiguration(): PluginConfig {
  if (this.testComponents!=null) {
    const ret = structuredClone(this.CONFIG) as PluginConfig;
    const previewConfig = structuredClone(this.PREVIEW_HANDLER_CONFIG) as ChangeHandlerConfig;
    if( (ret["schema-updates"]!=null) && (ret["preview-handlers"]!=null)) {
      ret["schema-updates"][0].id = this.testComponents.name;
      ret["schema-updates"][0].changes[0].update.enum[0].Test.enum.push(this.testComponents.forType);

      previewConfig.class.name=this.testComponents.name;
      previewConfig.location.values[0].Test.enum.push(this.testComponents.forType);
      ret["preview-handlers"].push(previewConfig);
      return ret;
    }
  }
  throw new Error ("No testComponent to register");
}

  pluginInit(dontCode: Core): void {
  }

}
