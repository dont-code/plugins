/**
 * Allow storing of entities in the browser local database
 */
import {
  AbstractDontCodeStoreProvider,
  DontCodeStoreCriteria,
  StoreProviderHelper,
  UploadedDocumentInfo
} from "@dontcode/core";
import {from, Observable} from "rxjs";
import Dexie, {Table} from "dexie";
import {Inject, Injectable, OnDestroy, Optional} from "@angular/core";
import {ValueService} from "@dontcode/plugin-common";
import {SANDBOX_CONFIG, SandboxLibConfig} from "../../config/sandbox-lib-config";

@Injectable({
  providedIn: 'root'
})
export class IndexedDbStorageService<T=never> extends AbstractDontCodeStoreProvider<T> implements OnDestroy {

  protected static globalDb: Dexie|null;

  protected db: Dexie|null=null;

  /**
   * Enable test code to close a database between tests
   */
  public static forceCloseDatabase () {
    console.log("IndexedDB: In forceCloseDatabase");
    if (this.globalDb!=null) {
      console.log("IndexedDB: GlobalDB Exist");
      if (this.globalDb.isOpen()) {
        console.log("IndexedDB: Closing GlobalDB");
        this.globalDb.close();
        console.log("IndexedDB: GlobalDB is closed");
      }
    }
  }

  public static forceDeleteDatabase (dbName:string):Promise<void> {
    console.log("IndexedDB: In forceDeleteDatabase");
    return Dexie.delete(dbName).then(() => {
      console.log("IndexedDB: Database "+dbName+" deleted");
    });
  }

  constructor(protected values: ValueService,
              @Optional() @Inject(SANDBOX_CONFIG) private config?: SandboxLibConfig
  ) {
    super();
      // Let unit tests close or delete the database between tests if needed
    if ((self as any)._indexedDbStorageServiceForceClose == null) {
      (self as any)._indexedDbStorageServiceForceClose = () => IndexedDbStorageService.forceCloseDatabase();
    }
    if ((self as any)._indexedDbStorageServiceForceDelete == null) {
      (self as any)._indexedDbStorageServiceForceDelete = (dbName:string) => IndexedDbStorageService.forceDeleteDatabase(dbName);
    }

/*    console.log("BUG:Testing 1");
    const db=new Dexie ("Bug", {allowEmptyDB:true, autoOpen:false});
    if( !db.isOpen()) {
      db.open().then(database => {
        database.close();
        console.log("BUG:Adding Table 1");
        database.version(database.verno+1).stores({
          "Table1": "__id++"
        });
        database.open().then(database => {
          console.log("BUG:Table 1 Added");
          database.table('Table1').put({"Name":"Nom1"}).then(value => {
            database.table('Table1').put({"Name": "Nom2"}).then(value1 => {
              database.close();

              console.log("BUG:Recreating Bug DB");
              const newdb=new Dexie ("Bug", {allowEmptyDB:true, autoOpen:false});

              newdb.open().then(database => {
                database.close();
                console.log("BUG:Adding Table 2 to v"+database.verno);
                database.version(database.verno+1).stores({
                  "Table2": "__id++"
                });
                database.open().then(database => {
                  console.log("BUG:Table 2 Added");
                  const table1 = database.table("Table1");
                  if( table1!=null)
                    console.log("BUG:Table1 Found", table1.name);
                  else {
                    console.log("BUG:Table1 not anymore");
                  }
                  console.log("BUG:End Testing");
                  database.close();
                })
            })
          })
        });
      });
    })
  }*/
}

  deleteEntity(position: string, key: any): Promise<boolean> {
    return this.ensurePositionCanBeStored(position, false).then(table => {
      return table.delete(key).then(() => {
        return true;
      });
    });

  }

  loadEntity(position: string, key: any): Promise<T|undefined> {
    return this.ensurePositionCanBeStored(position, false).then (table => {
      return table.get(key);
    }).catch(reason =>  {
      console.warn("IndexedDB: Cannot load entity "+key+" : "+reason);
      return undefined;
    });
  }

  override searchEntities(position: string, ...criteria: DontCodeStoreCriteria[]): Observable<Array<T>> {
    return from (
      this.ensurePositionCanBeStored(position, false).then(table => {
      return table.toArray().then(list => {
        return StoreProviderHelper.applyFilters(list, ...criteria);
      });
    }).catch(reason => {
      // Probably table not found, just returns empty values
        console.warn("IndexedDB: Cannot search entity: "+reason);
        return [];
      })
    );
  }

  canStoreDocument(position?: string): boolean {
    return false;
  }
  storeDocuments(toStore: File[], position?: string): Observable<UploadedDocumentInfo> {
    throw new Error("Impossible to store documents in IndexedDB.");
  }

  storeEntity(position: string, entity: any): Promise<T> {
    return this.ensurePositionCanBeStored(position, true).then(table => {
      return table.put(entity).then(key => {
        if ((entity._id) && (entity._id!==key)) {
          return Promise.reject("Stored entity with id "+key+" different from "+entity._id);
        } else {
          return entity;
        }

      });
    });
  }

  ensurePositionCanBeStored (position: string, create?:boolean):Promise<Table<T>> {
    const description=this.values.findAtPosition(position);
    if (description)
      return this.ensureEntityCanBeStored(description, create);
    else{
      return Promise.reject("Error called with null description");
    }
  }

  ensureEntityCanBeStored (description: any, create?:boolean):Promise<Table<T>> {
    return this.withDatabase().then (db => {
      // We have to make sure the database is open before we can get the list of tables
      let table;
      try {
        table = db.table(description.name);
      } catch (error) {
        // Just ignore table not found
      }
      if (table != null) return Promise.resolve(table);

      if (create) {
        const tableDescription: { [key: string]: string } = {};
        tableDescription[description.name] = '++_id';
        return this.changeSchema(db, tableDescription).then(db => {
          return db.table(description.name);
        });
      } else {
        return Promise.reject(description.name + ' table not found');
      }
    });
  }

  protected changeSchema(db : Dexie, schemaChanges:any): Promise<Dexie> {
    //console.log("IndexedDB: Closing DB");
    db.close();
/*    const newDb = new Dexie(db.name,{allowEmptyDB:true, autoOpen:false});

    newDb.on('blocked', ()=>false); // Silence console warning of blocked event.

    // Workaround: If DB is empty from tables, it needs to be recreated
    if (db.tables.length === 0) {
      return db.delete().then (value => {
        newDb.version(1.5).stores(schemaChanges);
        return newDb.open();
      })
    }

    // Extract current schema in dexie format:
    const currentSchema = db.tables.reduce((result:{[key:string]:any},{name, schema}) => {
      result[name] = [
        schema.primKey.src,
        ...schema.indexes.map(idx => idx.src)
      ].join(',');
      return result;
    }, {});
*/
    //console.log("Version: " + db.verno);
    //console.log("Current Schema: ", currentSchema);

    // Tell Dexie about current schema:
   // newDb.version(db.verno).stores(currentSchema);
    // Tell Dexie about next schema:
    //console.log("IndexedDB: Versioning DB to "+(db.verno + 1)+ " from tables "+this.allTables(db));
    db.version(db.verno + 1).stores(schemaChanges);
    // Upgrade it:
    //console.log("IndexedDB: Upgrading DB");
    return db.open().then (database => {
      //console.log("IndexedDB: Upgraded DB v"+database.verno+" to tables "+this.allTables(database));
      return database;
    });
  }

  withDatabase (): Promise<Dexie> {
    if (this.db==null) {

      let dbName = "Dont-code Sandbox Lib";
      if( (this.config)&&(this.config.indexedDbName)&&(this.config.indexedDbName.length>0))
        dbName=this.config.indexedDbName;

      //console.log("IndexedDB: Checking GlobalDB "+dbName);
      if(IndexedDbStorageService.globalDb==null) {
        IndexedDbStorageService.globalDb = new Dexie(dbName, {allowEmptyDB:true, autoOpen:false});
      //  console.log("IndexedDB: GlobalDB "+dbName+" created");
      }
      this.db=IndexedDbStorageService.globalDb;
      if( !this.db.isOpen()) {
  //      console.log("IndexedDB: Opening DB "+dbName);
        return this.db.open().then(database => {
    //      console.log ("IndexedDB: DB "+dbName+" v"+database.verno+" opened with tables "+this.allTables(database));
          return database;
        });
      }
    }
    return Promise.resolve(this.db);
  }

  ngOnDestroy () {
//    console.log("IndexedDB: ngOnDestroy called");
    IndexedDbStorageService.forceCloseDatabase();
  }

  allTables (db:Dexie): string {
    let ret="";
    for (const table of db.tables) {
      ret=ret+", "+table.name;
    }
    return ret;
  }
}
