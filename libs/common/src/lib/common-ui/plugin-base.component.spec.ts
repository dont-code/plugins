import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PluginBaseComponent } from "./plugin-base.component";
import { Component } from "@angular/core";
import {
  Change,
  ChangeType,
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodeSchemaManager,
  dtcde
} from "@dontcode/core";
import { Observable } from "rxjs";
import {DontCodeTestManager} from "@dontcode/core";


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

/*  it('should manage properly map field updates', () => {
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
*/

  it('should manage properly array updates', () => {
    let change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'ab', {
      "name": "id",
      "type": "number"
    });

    // Simple results first
    const map = new Map<string, any>();
    let array = new Array<TestArrayTarget>();
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(1);
    let result = new TestArrayTarget(change.value.name, change.value.type);
    expect(map.get('ab')).toBe(0);
    expect(array[0]).toEqual(result);

    // Check that it inserts item when the id is different
    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'bc', {
      "name": "name",
      "type": "string"
    });

    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(2);
    result = new TestArrayTarget(change.value.name, change.value.type);
    expect(map.get('bc')).toBe(1);
    expect(array[1]).toEqual(result);

    // Check that it just changes the existing item if the id is the same
    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'ab', {
      "name": "identity",
      "type": "number"
    });
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(2);
    result = new TestArrayTarget(change.value.name, change.value.type);
    expect(map.get('ab')).toBe(0);
    expect(array[0]).toEqual(result);

    // Prepare to return the exist values of the entitites/a
    component.initCommandFlow(new TestProviderInterface ({
      name:"newName", type:"string"
    }), createPointer('creation/entities/a'));

    // Check that it can changes the item when receiving an update of its subProperty
    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields','bc', "newName",'name');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(2);
    result = new TestArrayTarget("newName", "string");
    expect(map.get('bc')).toBe(1);
    expect(array[1]).toEqual(result);

    component.initCommandFlow(new TestProviderInterface ({
      name:"description"
    }), createPointer('creation/entities/a'));

      // Check that it creates a new item when receiving an update of its subProperty
    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields','ef', "description",'name');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toHaveLength(3);
    result = new TestArrayTarget("description", undefined);
    expect(map.get('ef')).toBe(2);
    expect(array[2]).toEqual(result);

  });

  it('should manage properly element move', () => {
    //First creates 3 elements a,b,c
    const map = new Map<string, any>();
    let array = new Array<TestArrayTarget>();
    const resultA = new TestArrayTarget("eltA", "number");
    const resultB = new TestArrayTarget("eltB", "string");
    const resultC = new TestArrayTarget("eltC", "number");

    let change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'a',
      resultA);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'b',
      resultB);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'c',
      resultC);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toHaveLength(3);
    expect(map.get('b')).toBe(1);
    expect(array[1]).toEqual(resultB);

    // Move b before a
    change = DontCodeTestManager.createMoveChange('b','a','creation/entities', 'a', 'fields', 'b');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array(resultB, resultA, resultC));
    expect(map).toEqual(new Map([
      ['a', 1],
      ['b', 0],
      ['c', 2]
    ]));
    // Move a after c, at the end
    change = DontCodeTestManager.createMoveChange('a',null,'creation/entities', 'a', 'fields', 'a');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array(resultB, resultC, resultA));
    expect(map).toEqual(new Map([
      ['a', 2],
      ['b', 0],
      ['c', 1]
    ]));
    // Move b before a
    change = DontCodeTestManager.createMoveChange('b','a','creation/entities', 'a', 'fields', 'b');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array( resultC, resultB, resultA));
    expect(map).toEqual(new Map([
      ['a', 2],
      ['b', 1],
      ['c', 0]
    ]));
    // Move a before b
    change = DontCodeTestManager.createMoveChange('a','b','creation/entities', 'a', 'fields', 'a');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array( resultC, resultA, resultB));
    expect(map).toEqual(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 0]
    ]));

  });

  it('should manage properly element delete', () => {
    //First creates 3 elements a,b,c
    const map = new Map<string, any>();
    let array = new Array<TestArrayTarget>();
    const resultA = new TestArrayTarget("eltA", "number");
    const resultB = new TestArrayTarget("eltB", "string");
    const resultC = new TestArrayTarget("eltC", "number");

    let change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'a',
      resultA);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'b',
      resultB);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'c',
      resultC);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toHaveLength(3);
    expect(map.get('b')).toBe(1);
    expect(array[1]).toEqual(resultB);

    // Delete b
    change = DontCodeTestManager.createDeleteChange('creation/entities', 'a', 'fields', 'b');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array(resultA, resultC));
    expect(map).toEqual(new Map([
      ['a', 0],
      ['c', 1]
    ]));
    // Delete a
    change = DontCodeTestManager.createDeleteChange('creation/entities', 'a', 'fields', 'a');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array(resultC));
    expect(map).toEqual(new Map([
      ['c', 0]
    ]));
      // Reinsert a
    change = DontCodeTestManager.createTestChange('creation/entities', 'a', 'fields', 'a',
      resultA);
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);
    expect(array).toEqual(new Array(resultC, resultA));
    expect(map).toEqual(new Map([
      ['c', 0],
      ['a', 1]
    ]));
    // Delete a
    change = DontCodeTestManager.createDeleteChange('creation/entities', 'a', 'fields', 'a');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array(resultC));
    expect(map).toEqual(new Map([
      ['c', 0]
    ]));

    // Delete c
    change = DontCodeTestManager.createDeleteChange('creation/entities', 'a', 'fields', 'c');
    array = component.applyUpdatesToArray(array, map, change, 'fields', transformToTarget);

    expect(array).toEqual(new Array());
    expect(map).toEqual(new Map());
  });

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
