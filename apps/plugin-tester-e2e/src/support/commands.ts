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
    clearPreviewUIDbCollection (collection:string): Promise<void>;
    //Doesn't work getService (service:any): Chainable<any>;
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

Cypress.Commands.add('getService', (service:any) => {
  let angular!: any;
  return getAngular()
    .then((ng) => {
      angular = ng;
    })
    .then(()=> cy.document())
    .then ((doc) => {
    return angular.getInjector (doc.querySelector('preview-ui-main')).get(service);
  });
});
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

Cypress.Commands.add('clearPreviewUIDbCollection', (collection:string) => {

  return new Promise<number>((resolve, reject) => {
    console.log("Checking DB Version");
    const checkversionrequest = window.indexedDB.open('Preview-UI');

    checkversionrequest.addEventListener('success', (evt) =>{
      console.log("In Check Version");
      const db:IDBDatabase = (evt.target as any).result;
      if (!db.objectStoreNames.contains( collection )) {
        console.log("Need to upgrade");
        const version = db.version;
        db.close();
        resolve (version);
      }else {
        const txn = db.transaction(collection, 'readwrite');
        txn.objectStore(collection).clear();
        resolve (-1);
      }
    });
  }).then((version:number) => {
    if (version!==-1) {
      // We need to create the collection, so force the upgrade....
      const upgraderequest = window.indexedDB.open('Preview-UI', version+1);

      console.log("Upgrade Request created");
      upgraderequest.addEventListener('upgradeneeded', ( event) => {
        console.log("upgrading");
        const db2:IDBDatabase = (event.target as any).result;
        db2.createObjectStore( collection,{keyPath:'_id', autoIncrement:true} );
        console.log("upgraded");

      });
    }
  })

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
