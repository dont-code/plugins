import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {DONTCODE_STORE_APÏ_URL, DontCodeApiStoreProvider} from "./dont-code-api-store-provider";
import {HttpClient} from "@angular/common/http";
import { dtcde } from '@dontcode/core';


describe('DontCode Api Store Manager', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let storeProvider: DontCodeApiStoreProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ {provide: DONTCODE_STORE_APÏ_URL, useValue: '/testData'}]
    }).compileComponents();

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    storeProvider = TestBed.inject(DontCodeApiStoreProvider);
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
