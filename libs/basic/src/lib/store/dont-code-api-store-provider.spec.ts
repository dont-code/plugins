import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {DontCodeApiStoreProvider} from "./dont-code-api-store-provider";
import {HttpClient} from "@angular/common/http";
import { dtcde, UploadedDocumentInfo } from '@dontcode/core';
import {toArray} from "rxjs/operators";
import { PluginCommonModule, DONT_CODE_COMMON_CONFIG, CommonConfigService} from "@dontcode/plugin-common";


describe('DontCode Api Store Manager', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let storeProvider: DontCodeApiStoreProvider<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PluginCommonModule.forRoot()],
      providers: []
    }).compileComponents();

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    storeProvider = TestBed.inject(DontCodeApiStoreProvider);
    const configService = TestBed.inject( CommonConfigService);
    // Reroute the API to our test 
    configService.batchUpdateConfig ({storeApiUrl:'/testData', documentApiUrl:'/testDocs'});
  });

  it('should list item', (done) => {
    expect(storeProvider).toBeDefined();
    dtcde.getModelManager().resetContent(EXEMPLE_TEMPLATE);
    storeProvider.searchEntities("creation/entities/aaaa").subscribe(value => {
      expect(value).toBeTruthy();
      done();
    }, error => {
      done(error);
    });
    const call=httpTestingController.expectOne("/testData/Entity1");
    call.flush([{Field1:"Test"},{Field1:"Test2"}]);

    httpTestingController.verify();
  });

  it('should create, get, delete item', (done) => {
    expect(storeProvider).toBeDefined();
    dtcde.getModelManager().resetContent(EXEMPLE_TEMPLATE);
      // Create the entity
    storeProvider.storeEntity("creation/entities/aaaa", {
      Field1:"Test12"
    }).then (value => {
      expect(value).toBeTruthy();
      expect(value._id).toBeTruthy();

      // Update the entity
      storeProvider.storeEntity("creation/entities/aaaa", {
        _id:"1343434",
        Field1:"Test23"
      }).then (value2 => {
        expect(value2._id).toEqual(value._id);
        // Delete the entity
        storeProvider.deleteEntity("creation/entities/aaaa", value2._id).then(value3 => {
          done();
        });
        call=httpTestingController.expectOne({method:'DELETE',url:"/testData/Entity1/1343434"});
        call.flush({_id:"1343434", Field1:"Test23"});
        httpTestingController.verify();
      });
      call=httpTestingController.expectOne({method:'PUT',url:"/testData/Entity1/1343434"});
      call.flush({_id:"1343434", Field1:"Test23"});

    }, error => {
      done(error);
    });
    let call=httpTestingController.expectOne({method:'POST',url: "/testData/Entity1"});
    call.flush({_id:"1343434", Field1:"Test12"});

  });

  it('should manage Items not found properly', (done) => {
    expect(storeProvider).toBeDefined();
    dtcde.getModelManager().resetContent(EXEMPLE_TEMPLATE);
    // Try to get an entity from a not existing model
    storeProvider.loadEntity("creation/entities/ERROR", "First").then (value => {
      done("No exception when getting an unknown entity");
    }, () => {
      // Try to load an  entity not found
      storeProvider.loadEntity("creation/entities/aaaa", "Second").then (value2 => {
        done("No error when trying to load an entity not found");
      }, () => {
        storeProvider.deleteEntity("creation/entities/aaaa", "Third").then (value2 => {
          done("No error when trying to delete a non existing entity");
        }, () => {
          done();
        });
        call=httpTestingController.expectOne("/testData/Entity1/Third");
        call.flush(null, { status: 404, statusText: "Element not found"});
        httpTestingController.verify();

      });
      let call=httpTestingController.expectOne("/testData/Entity1/Second");
      call.flush(null, { status: 404, statusText: "Element not found"});

    });

  });

  it('can store documents', (done) => {
    expect(storeProvider).toBeDefined();

    const toUpload = [
      new File (['Test file'], 'testFile.txt'),
      new File (['Test File2'], 'testFile2.txt')
    ];

    // Try to get an entity from a not existing model
    storeProvider.storeDocuments(toUpload).pipe(toArray()).subscribe({
      next:(responses => {
        expect(responses).toHaveLength(2);
      }),
      complete: (() => {
        done();
      }),
      error: (err => {
        done("Error ", err);
      })
    });
    let call=httpTestingController.expectOne("/testDocs");
    call.flush([
      {documentName: 'testFile.txt', isUrl:true, documentId:'/testDocs/13434'} as UploadedDocumentInfo,
      {documentName: 'testFile2.txt', isUrl:true, documentId:'/testDoc/13445'} as UploadedDocumentInfo
    ]);

  });

});


const EXEMPLE_TEMPLATE= {
  creation: {
    name: "Test1",
      type: "application",
      entities: {
      "aaaa": {
        name: "Entity1",
          fields: {
          "aaab": {
            name: "Field1",
              type: "string"
          }
        }
      },
      "aaac": {
        name: 'Entity2',
          fields: {
          "aaad": {
            name: 'Name',
              type: 'boolean'
          }
        }
      }
    },
    screens: {
      "aaae": {
        name: "Screen1"
      },
      "aaaf": {
        name: "Screen2"
      }
    }
  }
}
