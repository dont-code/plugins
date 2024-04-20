import { TestBed } from '@angular/core/testing';
import { GlobalPluginLoader } from './global-plugin-loader';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  dtcde,
  PluginConfig,
  PluginModuleInterface,
  PreviewHandler,
  Plugin,
  Change,
  ChangeType,
  DontCodeTestManager,
  CommandProviderInterface,
  DontCodeModelPointer, Core,
} from '@dontcode/core';
import { NgModule } from '@angular/core';
import { ChangeProviderService } from '../command/services/change-provider.service';
import { asyncScheduler, Subject, Subscription } from 'rxjs';
import {PluginCommonModule, PluginHandlerHelper} from '@dontcode/plugin-common';

export class GlobalTestHandler implements PreviewHandler {
  public static initCalls = new Subject<DontCodeModelPointer>();
  public static handleChanges = new Subject<Change>();
  public static subscribers = new Subscription ();

  protected static pluginHelper = new PluginHandlerHelper();

  static close() {
    GlobalTestHandler.subscribers.unsubscribe();
    GlobalTestHandler.pluginHelper.unsubscribe();
  }

  initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ): void {
    GlobalTestHandler.initCalls.next(pointer);
    GlobalTestHandler.pluginHelper.initCommandFlow(provider, pointer, this);
    GlobalTestHandler.pluginHelper.decomposeJsonToMultipleChanges(
      pointer,
      provider.getJsonAt(pointer.position)
    );
    GlobalTestHandler.pluginHelper.initChangeListening();
  }

  handleChange(change: Change): void {
    GlobalTestHandler.handleChanges.next(change);
  }
}

@NgModule({
  providers: [GlobalTestHandler],
  id: 'dontcode-plugin/global-test-module',
})
export class GlobalTestModule implements PluginModuleInterface {
  handlers = new Map<string, any>([['GlobalTestHandler', GlobalTestHandler]]);

  exposedPreviewHandlers(): Map<string, any> {
    return this.handlers;
  }
}

describe('GlobalPluginLoaded', () => {
  let loader: GlobalPluginLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, GlobalTestModule, PluginCommonModule.forRoot()],
    });
    loader = TestBed.inject(GlobalPluginLoader);
  });

  afterAll(() => {
    loader.close();
    GlobalTestHandler.close();
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  it('should load global plugins', (done) => {
    const notifiedInit = waitableJestFn(1);
    const notifiedCall = waitableJestFn(4);

    GlobalTestHandler.subscribers.add(
      GlobalTestHandler.initCalls.subscribe({
        next: (pointer) => {
          notifiedInit();
        },
        error: (err) => {
          done(err);
        },
      })
    );

    GlobalTestHandler.subscribers.add(
      GlobalTestHandler.handleChanges.subscribe({
        next: (change) => {
          if (change.pointer?.lastElement === 'type')
            // I'm only interested in type changes
            notifiedCall();
        },
        error: (err) => {
          done(err);
        },
      })
    );

    const previewMgr = dtcde.getPreviewManager();
    previewMgr.registerHandlers(
      new GlobalHandlerPluginTest().getConfiguration()
    );
    loader.initLoading();

    // Ensure the initialization is done before the changes are handled
    asyncScheduler.schedule(() => {
      const chgeProvider = TestBed.inject(ChangeProviderService);
      chgeProvider.pushChange(
        DontCodeTestManager.createAnyChange(
          ChangeType.ADD,
          'creation',
          null,
          'sources',
          'aaaa',
          { type: 'Rest', url: 'https://test/url' }
        )
      );

      chgeProvider.pushChange(
        DontCodeTestManager.createAnyChange(
          ChangeType.UPDATE,
          'creation',
          null,
          'sources',
          'aaaa',
          'Other',
          'type'
        )
      );

      chgeProvider.pushChange(
        DontCodeTestManager.createAnyChange(
          ChangeType.UPDATE,
          'creation',
          null,
          'sources',
          'aaaa',
          'Rest',
          'type'
        )
      );

      chgeProvider.pushChange(
        DontCodeTestManager.createAnyChange(
          ChangeType.DELETE,
          'creation',
          null,
          'sources',
          'aaaa',
          null
        )
      );

      notifiedInit.waitUntilComplete();
      notifiedCall.waitUntilComplete();
      expect(notifiedInit).toHaveBeenCalledTimes(1);
      expect(notifiedCall).toHaveBeenCalledTimes(5);
      done();
    });
  });
});

class GlobalHandlerPluginTest implements Plugin {
  getConfiguration(): PluginConfig {
    return {
      plugin: {
        id: 'GlobalHandlerPlugin',
        'display-name': 'Testing Global Handlers ',
        version: '1.0.0',
      },
      'global-handlers': [
        {
          location: {
            parent: 'creation/sources',
            id: 'type',
          },
          class: {
            name: 'GlobalTestHandler',
            source: 'global-test-module',
          },
        },
      ],
    };
  }

  pluginInit(dontCode: Core): void {
    // Empty
  }
}

// Standard code to wait for a number of calls before testing the result
type WaitableMock = jest.Mock & {
  waitUntilComplete(): Promise<void>;
};

export const waitableJestFn = (times: number): WaitableMock => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let _resolve: Function;
  const promise = new Promise<void>((resolve) => (_resolve = resolve));

  let i = 0;
  const mock = jest.fn(() => {
    // debug('mock is called', i, times)
    if (++i >= times) _resolve();
  }) as WaitableMock; // force casting

  mock.waitUntilComplete = () => promise;

  return mock;
};
