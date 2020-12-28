import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PluginBaseComponent } from "./plugin-base.component";
import { Component } from "@angular/core";
import { Change, ChangeType, DontCodeModelPointer } from "@dontcode/core";


describe('PluginBaseComponent', () => {
  let component: PluginBaseComponent;
  let fixture: ComponentFixture<PluginBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBaseComponent ]
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

  it('should manage properly array updates', () => {
    let change = new Change (ChangeType.ADD,
      'creation/entities/a/fields/ab',
      {
        "name": "id",
        "type": "string"
       }, new DontCodeModelPointer(
        'creation/entities/a/fields/ab',
        'creation/entities/fields',
        'creation/entities/a',
        'creation/entities',
        null,
        'ab'
      ));

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
      "xy":{
      "name":"id",
      "type":"number"
      }
    }, 'fields');
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['ab']).toBe(change.value);

    result = component.decodeMapField(change, {
      "xy":{
          "name":"pizza",
          "type":"number"
        },
      "ab":{
        "name":"otherName",
        "type":"number"
      },
      "cd":{
        "name":"id",
        "type":"number"
      }
      }, 'fields');
    expect(Object.keys(result)).toHaveLength(3);
    expect(result['ab'].name).toBe(change.value.name);
    expect(result['ab'].type).toBe(change.value.type);

  });
});

@Component({
  template: ``
})
class TestBaseComponent extends PluginBaseComponent {
}
