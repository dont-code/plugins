import {TestBed} from '@angular/core/testing';

import {RemotePluginLoaderService, RemotePluginModuleOptions} from './remote-plugin-loader.service';
import {dtcde, PluginModuleInterface, RepositoryPluginEntry, RepositoryPluginInfo} from "@dontcode/core";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Injectable} from "@angular/core";

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

  it('should load default plugin config', (done) => {
    TestRemotePluginLoaderService.listOfInfoToTest.length=0;
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
    httpTestingController.expectOne("assets/repositories/test.json").flush( TEST_JSON);
    httpTestingController.verify();
  });

  it('should handle config overloading', (done) => {
    // @ts-ignore
    TestRemotePluginLoaderService.listOfInfoToTest.push(...TEST_OVERLOAD_JSON.plugins.map((val:RepositoryPluginEntry) => val.info));
    service.loadPluginsFromRepository("assets/repositories/test-overload.json","assets/repositories/default.json").then(value => {
      expect (value.plugins).toHaveLength(2);
      const configs=service.listAllRepositoryConfigUpdates();
      expect(configs).toHaveLength(1);
      dtcde.getModelManager().applyPluginConfigUpdates(configs);
      const added = dtcde.getModelManager().findAtPosition("creation/entities/a");
      expect(added).toEqual({
        name:"TestOverload"
      });
      done();
    }).catch(error => {
      done(error);
    })
    httpTestingController.expectOne("assets/repositories/test-overload.json").flush( TEST_OVERLOAD_JSON);
    httpTestingController.verify();
  });

});

const TEST_JSON={
  "$schema": "https://dont-code.net/schemas/v1/repository-schema.json",
  "name": "Test Repository",
  "description": "Repository for testing basic repository config",
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

const TEST_OVERLOAD_JSON={
  "$schema": "https://dont-code.net/schemas/v1/repository-schema.json",
  "name": "Test Overload Repository",
  "description": "Repository to test management of overloaded info",
  "plugins": [
    {
      "id": "BasicOverload",
      "display-name": "Test Basic plugin with overloaded params",
      "version": "1.0.0",
      "info": {
        "remote-entry": "https://test.dont-code.net/basic-overload/remoteEntry.mjs"
      }
    },
    {
      "id": "BasicOverloadConfig",
      "display-name": "Basic plugin again with config and overloaded params",
      "version": "1.0.0",
      "info": {
        "exposed-module":"./BasicOverload",
        "remote-entry":"https://test.dont-code.net/basic-overload-config/remoteEntry.mjs",
        "module-name": "BasicOverloadModule"
      },
      "config": {
        "definition-updates": [{
          "location": {
            "parent": "creation/entities",
            "id": "*"
          },
          "update": {
            "name": "TestOverload"
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
@Injectable()
class TestRemotePluginLoaderService extends RemotePluginLoaderService {

  public static listOfInfoToTest=new Array<RepositoryPluginInfo>();

  override async loadModule(moduleDef: RemotePluginModuleOptions): Promise<PluginModuleInterface> {
    const toCheck = TestRemotePluginLoaderService.listOfInfoToTest.shift();
    if (toCheck!=null) {
      expect (moduleDef.remoteEntry).toEqual(toCheck["remote-entry"]);
      if (toCheck["exposed-module"]!=null)
        expect(moduleDef.exposedModule).toEqual(toCheck["exposed-module"]);
      else
        expect(moduleDef.exposedModule).toBeTruthy();
    }
    return Promise.resolve(new TestPluginModuleInterface ());

  }
}


class TestPluginModuleInterface implements PluginModuleInterface{
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any>();
  }

}
