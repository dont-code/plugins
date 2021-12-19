import {TestBed} from '@angular/core/testing';
import {GlobalPluginLoader} from "./global-plugin-loader";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {dtcde, PluginConfig, PluginModuleInterface, PreviewHandler, Plugin, Change, ChangeType, DontCodeTestManager, CommandProviderInterface, DontCodeModelPointer} from '@dontcode/core';
import {NgModule} from "@angular/core";
import {ChangeProviderService} from "../command/services/change-provider.service";
import {Subject, Subscriber} from "rxjs";
import {PluginHandlerHelper} from "@dontcode/plugin-common";


export class GlobalTestHandler implements PreviewHandler {
  public static initCalls=new Subject<DontCodeModelPointer>();
  public static handleChanges=new Subject<Change>();
  public static subscribers = new Subscriber();

  protected static pluginHelper = new PluginHandlerHelper();

  static close () {
    GlobalTestHandler.subscribers.unsubscribe();
    GlobalTestHandler.pluginHelper.unsubscribe();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): void {
    GlobalTestHandler.initCalls.next(pointer);
    GlobalTestHandler.pluginHelper.initCommandFlow(provider, pointer, this);
    GlobalTestHandler.pluginHelper.decomposeJsonToMultipleChanges(pointer, provider.getJsonAt(pointer.position));
    GlobalTestHandler.pluginHelper.initChangeListening();
  }

  handleChange(change: Change): void {
    GlobalTestHandler.handleChanges.next(change);
  }


}

@NgModule({
  exports: [
    GlobalTestHandler
  ],
  providers: [GlobalTestHandler],
  id:'dontcode-plugin/global-test-module'
})
export class GlobalTestModule implements PluginModuleInterface
{
  handlers = new Map<string, any> ([
    ['GlobalTestHandler', GlobalTestHandler]]);

    exposedPreviewHandlers(): Map<string, any> {
        return this.handlers;
    }

}


describe('GlobalPluginLoaded', () => {
  let loader: GlobalPluginLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, GlobalTestModule]
    });
    loader = TestBed.inject(GlobalPluginLoader);
  });

  afterAll(() => {
    loader.close();
    GlobalTestHandler.close();
  })

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  it('should load global plugins', (done) => {

    let initCallCount = 0;
    let changeCallCount = 0;
    const previewMgr = dtcde.getPreviewManager();
    previewMgr.registerHandlers(new GlobalHandlerPluginTest().getConfiguration());
    loader.initLoading(previewMgr);

    GlobalTestHandler.subscribers.add(GlobalTestHandler.initCalls.subscribe ({
      next: pointer => {
        initCallCount++;
        if (initCallCount >1) {
          done("InitCall called multiple times");
        }
      },
      error: err => {
        done(err);
      }
    }));

    GlobalTestHandler.subscribers.add(GlobalTestHandler.handleChanges.subscribe ({
      next: pointer => {
        changeCallCount++;
        if (initCallCount!=1) {
          done ("initCallCount not called before handleChange");
        }
        if( changeCallCount==4)
          done ();
      },
      error: err => {
        done(err);
      }
    }));

    const chgeProvider = TestBed.inject(ChangeProviderService);
    chgeProvider.pushChange(
      DontCodeTestManager.createAnyChange(ChangeType.ADD, 'creation', null, 'sources','aaaa', {type:'Rest', url:'https://test/url'})
    );

    chgeProvider.pushChange(
      DontCodeTestManager.createAnyChange(ChangeType.UPDATE, 'creation', 'sources', 'aaaa', null, 'Other', 'type')
    );

    chgeProvider.pushChange(
      DontCodeTestManager.createAnyChange(ChangeType.UPDATE, 'creation', 'sources', 'aaaa', null, 'Rest', 'type')
    );

    chgeProvider.pushChange(
      DontCodeTestManager.createAnyChange(ChangeType.DELETE, 'creation', 'sources', 'aaaa',null, null)
    );

  });

});

class GlobalHandlerPluginTest implements Plugin {
  getConfiguration(): PluginConfig {
    return {
      "plugin": {
        "id": "GlobalHandlerPlugin",
        "display-name": "Testing Global Handlers ",
        "version": "1.0.0"
      },
      "global-handlers": [
        {
          "location": {
            "parent": "creation/sources/?",
            "id":"type"
          },
          "class": {
            "name":"GlobalTestHandler",
            "source":"global-test-module"
          }
        }
      ]
    }
  }
}

