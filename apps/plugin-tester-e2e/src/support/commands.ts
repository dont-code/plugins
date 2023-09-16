// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    findNgComponent (selector:string): Chainable<any>;
    applyChanges (component: any):void;
    getAngular (): Chainable<any>;
    clearDbCollections (dbName:string,...collections:string[]): Cypress.Chainable<any>;
    forceDeleteIndexedDbStorage (dbName:string): Cypress.Chainable<any>;
  }
}

function getAngular () {
  let angular!: any;
//  console.log('ngComponent', selector);
  // You can access the window object in cypress using
  //   window() method
  return cy.window()
    .then((win) => {
      // Grab a reference to the global ng object
      angular = (win as any).ng;
      console.log("Angular=", angular);

      return angular;
    });
}

/*Cypress.Commands.add('getService', (service:any) => {
  let angular!: any;
  return getAngular()
    .then((ng) => {
      angular = ng;
    })
    .then(()=> cy.document())
    .then ((doc) => {
    return angular.getInjector (doc.querySelector('preview-ui-main')).get(service);
  });
});*/
//
// -- This is a parent command --

Cypress.Commands.add('getAngular', () => {
  return getAngular();
});

Cypress.Commands.add('applyChanges', (component: any) => {
    getAngular().then((ng:any) =>{
      if( ng.applyChanges)
        ng.applyChanges(component);
    });
});

Cypress.Commands.add('findNgComponent', (selector: string) => {
  let angular!: any;
//  console.log('ngComponent', selector);
  // You can access the window object in cypress using
  //   window() method
  return getAngular()
    .then((ng) => {
      angular = ng;
    })
    .then(() => cy.document())
    .then((doc) =>{
      const componentInstance = angular
        .getComponent(doc.querySelector(selector));
      return componentInstance;
    });
});

Cypress.Commands.add('forceDeleteIndexedDbStorage', (dbName:string) => {
  console.log("Test: Deleting DB "+dbName);
  return cy.window().then ( (win) => {
    return cy.wrap (new Promise<void>((resolve, reject)=>  {
      if ((win as any)._indexedDbStorageServiceForceDelete != null) {
        console.log("Test: DB Delete Call");
        (win as any)._indexedDbStorageServiceForceDelete(dbName).then(() => {
          console.log("Test: DB Deleted");
          resolve();
        }).catch ( (reason:any) => {
          reject(reason);
        });
      } else {
        reject("Test: No Delete function in global window");
      }
    }));
  });
});

Cypress.Commands.add('clearDbCollections', (dbName:string, ...collections:string[]) => {

  return cy.wrap (new Promise<void>((resolve, reject) => {
    console.log("Test: Cleaning DB");
    const checkversionrequest = window.indexedDB.open(dbName);

    checkversionrequest.onsuccess = (evt) => {
      console.debug("Test: Opening IndexedDB");
      const db: IDBDatabase = (evt.target as any).result;

      for (const collection of collections) {
        if (db.objectStoreNames.contains(collection)) {
          //console.debug("Test: Clearing collection "+collection);
          const txn = db.transaction(collection, 'readwrite');
          txn.objectStore(collection).clear();
          txn.commit();
          console.debug("Test: Collection cleared " + collection);
        }
      }
      db.close();
      console.debug("Test: Closed IndexedDB");
      resolve();
    };

    checkversionrequest.onerror = (evt) => {
      reject("Test: Cannot open Database " + dbName + " because of " + evt.target);
    }
    resolve();
  }));
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
