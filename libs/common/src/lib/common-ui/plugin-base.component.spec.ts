import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PluginBaseComponent } from "./plugin-base.component";
import { Component } from "@angular/core";
import {
  Change,
  ChangeType,
  CommandProviderInterface, DontCode,
  DontCodeModelPointer,
  DontCodeSchemaManager
} from "@dontcode/core";
import { Observable } from "rxjs";
import dtcde = DontCode.dtcde;


describe('PluginBaseComponent', () => {
  let component: PluginBaseComponent;
  let fixture: ComponentFixture<PluginBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestBaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should manage properly map field updates', () => {
    let change = createTestChange('creation/entities', 'a', 'fields', 'ab',
      {
        "name": "id",
        "type": "string"
      });

    // Simple results first

    let result = component.decodeMapField(change, {}, 'fields');
    expect(Object.keys(result)).toHaveLength(1);
    expect(result['ab']).toBe(change.value);
    result = component.decodeMapField(change, null, 'fields');
    expect(Object.keys(result)).toHaveLength(1);
    expect(result['ab']).toBe(change.value);

    // Check that it ignores when the key is wrong
    result = component.decodeMapField(change, {}, 'others');
    expect(result).toBeUndefined();
    result = component.decodeMapField(change, null, 'others');
    expect(result).toBeUndefined();

    // Check that it inserts item when the id is different

    result = component.decodeMapField(change, {
      "xy": {
        "name": "id",
        "type": "number"
      }
    }, 'fields');
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['ab']).toBe(change.value);

    result = component.decodeMapField(change, {
      "xy": {
        "name": "pizza",
        "type": "number"
      },
      "ab": {
        "name": "otherName",
        "type": "number"
      },
      "cd": {
        "name": "id",
        "type": "number"
      }
    }, 'fields');
    expect(Object.keys(result)).toHaveLength(3);
    expect(result['ab'].name).toBe(change.value.name);
    expect(result['ab'].type).toBe(change.value.type);

  });

  it('should manage properly array updates', () => {
    let change = createTestChange('creation/entities', 'a', 'fields', 'ab', {
      "name": "id",
      "type": "number"
    });

    // Simple results first
    let map = new Map<string, any>();
    let array = new Array<TestArrayTarget>();
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(1);
    let result = new TestArrayTarget(change.value.name, change.value.type);
    expect(map.get('ab')).toBe(0);
    expect(array[0]).toEqual(result);

    // Check that it inserts item when the id is different
    change = createTestChange('creation/entities', 'a', 'fields', 'bc', {
      "name": "name",
      "type": "string"
    });

    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(2);
    result = new TestArrayTarget(change.value.name, change.value.type);
    expect(map.get('bc')).toBe(1);
    expect(array[1]).toEqual(result);

    // Check that it just changes the existing item if the id is the same
    change = createTestChange('creation/entities', 'a', 'fields', 'ab', {
      "name": "identity",
      "type": "number"
    });
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(2);
    result = new TestArrayTarget(change.value.name, change.value.type);
    expect(map.get('ab')).toBe(0);
    expect(array[0]).toEqual(result);

    component.initCommandFlow(new TestProviderInterface ({
      name:"newName", type:"string"
    }), createPointer('creation/entities/a'));

    // Check that it can changes the item when receiving an update of its subProperty
    change = createTestChange('creation/entities', 'a', 'fields','bc', "newName",'name');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(2);
    result = new TestArrayTarget("newName", "string");
    expect(map.get('bc')).toBe(1);
    expect(array[1]).toEqual(result);

    component.initCommandFlow(new TestProviderInterface ({
      name:"description"
    }), createPointer('creation/entities/a'));

      // Check that it creates a new item when receiving an update of its subProperty
    change = createTestChange('creation/entities', 'a', 'fields','ef', "description",'name');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(3);
    result = new TestArrayTarget("description", undefined);
    expect(map.get('ef')).toBe(2);
    expect(array[2]).toEqual(result);

  });

  function createTestChange(containerSchema: string, containerItemId: string, schema: string, itemId: string, value: any, property?:string) {
    if( property) {
      return new Change(ChangeType.ADD,
        containerSchema + '/' + containerItemId + '/' + schema+'/'+itemId+'/'+property,
        value, new DontCodeModelPointer(
          containerSchema + '/' + containerItemId + '/' + schema+'/'+itemId+'/'+property,
          containerSchema + '/' + schema+'/'+property,
          containerSchema + '/' + containerItemId+'/'+schema+'/'+itemId,
          containerSchema + '/' + schema,
          property,
          null
        ));
    } else {
      return new Change(ChangeType.ADD,
        containerSchema + '/' + containerItemId + '/' + schema + '/' + itemId,
        value, new DontCodeModelPointer(
          containerSchema + '/' + containerItemId + '/' + schema + '/' + itemId,
          containerSchema + '/' + schema,
          containerSchema + '/' + containerItemId,
          containerSchema,
          null,
          itemId
        ));

    }
  };

  function transformToTarget(key: string, value: any): TestArrayTarget {
    return new TestArrayTarget(value.name, value.type);
  }

  function createPointer(position: string) {
    return new DontCodeModelPointer(position, position,position,position,"test", null);
  }

});

class TestArrayTarget {
  name:string;
  type:string;


  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

class TestProviderInterface implements CommandProviderInterface {

  constructor(protected toRet: any) {

  }

  getJsonAt(position: string): any {
    return this.toRet;
  }

  receiveCommands(position?: string, lastItem?: string): Observable<Change> {
    return undefined;
  }

  calculatePointerFor(position: string): DontCodeModelPointer {
    return dtcde.getSchemaManager().generateSchemaPointer(position);
  }

  getSchemaManager(): DontCodeSchemaManager {
    return dtcde.getSchemaManager();
  }

}

@Component({
  template: ``
})
class TestBaseComponent extends PluginBaseComponent {
  protected handleChange(change: Change) {
  }
}
