import {TestBed} from '@angular/core/testing';

import {RemotePluginLoaderService, RemotePluginModuleOptions} from './remote-plugin-loader.service';
import {dtcde, PluginModuleInterface} from "@dontcode/core";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('RemotePluginLoaderService', () => {
  let service: RemotePluginLoaderService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule ], providers: [
        {provide: RemotePluginLoaderService, useClass: TestRemotePluginLoaderService}
      ]});
    service = TestBed.inject(RemotePluginLoaderService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default plugin config', (done) => {
    service.loadPluginsFromRepository("assets/repositories/test.json","assets/repositories/default.json").then(value => {
      expect (value.plugins).toHaveLength(2);
      const configs=service.listAllRepositoryConfigUpdates();
      expect(configs).toHaveLength(1);
      dtcde.getModelManager().applyPluginConfigUpdates(configs);
      const added = dtcde.getModelManager().findAtPosition("creation/sources/a");
      expect(added).toEqual({
        name:"Test"
      });
      done();
    }).catch(error => {
      done(error);
    })
    httpTestingController.match("assets/repositories/test.json").forEach(value => {
      value.flush(TEST_JSON);
    })

    httpTestingController.verify();
  });

});

const TEST_JSON={
  "$schema": "https://dont-code.net/schemas/v1/repository-schema.json",
  "name": "Default Repository",
  "description": "Repository provided by Dont-code offering all defaults plugins",
  "plugins": [
  {
    "id": "Basic",
    "display-name": "Test Basic plugin with no config",
    "version": "1.0.0",
    "config": {}
  },
  {
    "id": "BasicConfig",
    "display-name": "Basic plugin again with config",
    "version": "1.0.0",
    "info": {

    },
    "config": {
      "definition-updates": [{
        "location": {
          "parent": "creation/sources",
          "id": "*"
        },
        "update": {
          "name": "Test"
        }
      }
    ]

    }
  }
]
}

/**
 * Overrides the dynamic loading of modules as obviously this will not work in unit test
 */
class TestRemotePluginLoaderService extends RemotePluginLoaderService {

  override async loadModule(moduleDef: RemotePluginModuleOptions): Promise<PluginModuleInterface> {
    return Promise.resolve(new TestPluginModuleInterface ());
  }
}

class TestPluginModuleInterface implements PluginModuleInterface{
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any>();
  }

}
