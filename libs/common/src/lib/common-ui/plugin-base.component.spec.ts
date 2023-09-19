import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PluginBaseComponent } from './plugin-base.component';
import {ChangeDetectorRef, Component, Injector} from '@angular/core';
import {
    Action,
  Change,
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodeSchemaManager,
  DontCodeTestManager,
  dtcde,
} from '@dontcode/core';
import {Observable} from 'rxjs';
import {PossibleTemplateList, TemplateList} from './template-list';
import {ComponentLoaderService, PluginCommonModule} from '@dontcode/plugin-common';
import DoneCallback = jest.DoneCallback;

describe('PluginBaseComponent', () => {
  let component: PluginBaseComponent;
  let fixture: ComponentFixture<PluginBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PluginCommonModule.forRoot()],
      declarations: [TestBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should manage properly array updates', (done) => {
    testArrayUpdates(null, done);
  });

  it('should manage properly subArray updates', (done) => {
    testArrayUpdates('fields', done);
  });

  function testArrayUpdates(subArray: string | null, done: DoneCallback) {
    let change = DontCodeTestManager.createTestChange(
      'creation/entities',
      'a',
      'fields',
      'ab',
      {
        name: 'id',
        type: 'number',
      }
    );
    const provider = new TestProviderInterface(null);
    let entityPointer = provider.calculatePointerFor(
      change.getSafeParentPosition()
    );
    // We are testing for an array as subElement of the entityPointer, not the entityPointer itself
    if (subArray != null) {
      entityPointer = provider.calculatePointerFor(
        entityPointer.containerPosition!
      );
    }
    component.initCommandFlow(provider, entityPointer);

    // Simple results first
    const map = new Map<string, any>();
    const srcArray = new Array<TestArrayTarget>();
    component
      .applyUpdatesToArrayAsync(
        srcArray,
        map,
        change,
        subArray,
        transformToTarget
      )
      .then((array) => {
        expect(array).toHaveLength(1);
        let result = new TestArrayTarget(change.value.name, change.value.type);
        expect(map.get('ab')).toBe(0);
        expect(array[0]).toEqual(result);

        // Check that it inserts item when the id is different
        change = DontCodeTestManager.createTestChange(
          'creation/entities',
          'a',
          'fields',
          'bc',
          {
            name: 'name',
            type: 'string',
          }
        );

        // tslint:disable-next-line:no-shadowed-variable
        component
          .applyUpdatesToArrayAsync(
            array,
            map,
            change,
            subArray,
            transformToTarget
          )
          .then((array) => {
            expect(array).toHaveLength(2);
            result = new TestArrayTarget(change.value.name, change.value.type);
            expect(map.get('bc')).toBe(1);
            expect(array[1]).toEqual(result);

            // Check that it just changes the existing item if the id is the same
            change = DontCodeTestManager.createTestChange(
              'creation/entities',
              'a',
              'fields',
              'ab',
              {
                name: 'identity',
                type: 'number',
              }
            );
            // tslint:disable-next-line:no-shadowed-variable
            component
              .applyUpdatesToArrayAsync(
                array,
                map,
                change,
                subArray,
                transformToTarget
              )
              .then((array) => {
                expect(array).toHaveLength(2);
                result = new TestArrayTarget(
                  change.value.name,
                  change.value.type
                );
                expect(map.get('ab')).toBe(0);
                expect(array[0]).toEqual(result);

                // Prepare to return the exist values of the entitites/a
                component.initCommandFlow(
                  new TestProviderInterface({
                    name: 'newName',
                    type: 'string',
                  }),
                  createPointer('creation/entities/a')
                );

                // Check that it can changes the item when receiving an update of its subProperty
                change = DontCodeTestManager.createTestChange(
                  'creation/entities',
                  'a',
                  'fields',
                  'bc',
                  'newName',
                  'name'
                );
                // tslint:disable-next-line:no-shadowed-variable
                component
                  .applyUpdatesToArrayAsync(
                    array,
                    map,
                    change,
                    subArray,
                    transformToTarget
                  )
                  .then((array) => {
                    expect(array).toHaveLength(2);
                    result = new TestArrayTarget('newName', 'string');
                    expect(map.get('bc')).toBe(1);
                    expect(array[1]).toEqual(result);

                    component.initCommandFlow(
                      new TestProviderInterface({
                        name: 'description',
                      }),
                      createPointer('creation/entities/a')
                    );

                    // Check that it creates a new item when receiving an update of its subProperty
                    change = DontCodeTestManager.createTestChange(
                      'creation/entities',
                      'a',
                      'fields',
                      'ef',
                      'description',
                      'name'
                    );
                    // tslint:disable-next-line:no-shadowed-variable
                    component
                      .applyUpdatesToArrayAsync(
                        array,
                        map,
                        change,
                        subArray,
                        transformToTarget
                      )
                      .then((array) => {
                        expect(array).toHaveLength(3);
                        result = new TestArrayTarget('description', undefined);
                        expect(map.get('ef')).toBe(2);
                        expect(array[2]).toEqual(result);
                        done();
                      })
                      .catch((reason) => {
                        done(reason);
                      });
                  })
                  .catch((reason) => {
                    done(reason);
                  });
              })
              .catch((reason) => {
                done(reason);
              });
          })
          .catch((reason) => {
            done(reason);
          });
      })
      .catch((reason) => {
        done(reason);
      });
  }

  it('should manage properly element move', (done) => {
    testElementMove(null, done);
  });

  it('should manage properly subArray element move', (done) => {
    testElementMove('fields', done);
  });

  function testElementMove(subArray: string | null, done: DoneCallback) {
    //First creates 3 elements a,b,c

    const map = new Map<string, any>();
    const array = new Array<TestArrayTarget>();
    const resultA = new TestArrayTarget('eltA', 'number');
    const resultB = new TestArrayTarget('eltB', 'string');
    const resultC = new TestArrayTarget('eltC', 'number');

    let change = DontCodeTestManager.createTestChange(
      'creation/entities',
      'a',
      'fields',
      'a',
      resultA
    );
    // tslint:disable-next-line:no-shadowed-variable
    const provider = new TestProviderInterface(null);
    let entityPointer = provider.calculatePointerFor(
      change.getSafeParentPosition()
    );
    // We are testing for an array as subElement of the entityPointer, not the entityPointer itself
    if (subArray != null) {
      entityPointer = provider.calculatePointerFor(
        entityPointer.containerPosition!
      );
    }
    component.initCommandFlow(provider, entityPointer);
    component
      .applyUpdatesToArrayAsync(array, map, change, subArray, transformToTarget)
      .then((array) => {
        change = DontCodeTestManager.createTestChange(
          'creation/entities',
          'a',
          'fields',
          'b',
          resultB
        );
        // tslint:disable-next-line:no-shadowed-variable
        component
          .applyUpdatesToArrayAsync(
            array,
            map,
            change,
            subArray,
            transformToTarget
          )
          .then((array) => {
            change = DontCodeTestManager.createTestChange(
              'creation/entities',
              'a',
              'fields',
              'c',
              resultC
            );
            // tslint:disable-next-line:no-shadowed-variable
            component
              .applyUpdatesToArrayAsync(
                array,
                map,
                change,
                subArray,
                transformToTarget
              )
              .then((array) => {
                expect(array).toHaveLength(3);
                expect(map.get('b')).toBe(1);
                expect(array[1]).toEqual(resultB);

                // Move b before a
                change = DontCodeTestManager.createMoveChange(
                  'b',
                  'a',
                  'creation/entities',
                  'a',
                  'fields',
                  'b'
                );
                // tslint:disable-next-line:no-shadowed-variable
                component
                  .applyUpdatesToArrayAsync(
                    array,
                    map,
                    change,
                    subArray,
                    transformToTarget
                  )
                  .then((array) => {
                    expect(array).toEqual(new Array(resultB, resultA, resultC));
                    expect(map).toEqual(
                      new Map([
                        ['a', 1],
                        ['b', 0],
                        ['c', 2],
                      ])
                    );
                    // Move a after c, at the end
                    change = DontCodeTestManager.createMoveChange(
                      'a',
                      null,
                      'creation/entities',
                      'a',
                      'fields',
                      'a'
                    );
                    // tslint:disable-next-line:no-shadowed-variable
                    component
                      .applyUpdatesToArrayAsync(
                        array,
                        map,
                        change,
                        subArray,
                        transformToTarget
                      )
                      .then((array) => {
                        expect(array).toEqual(
                          new Array(resultB, resultC, resultA)
                        );
                        expect(map).toEqual(
                          new Map([
                            ['a', 2],
                            ['b', 0],
                            ['c', 1],
                          ])
                        );
                        // Move b before a
                        change = DontCodeTestManager.createMoveChange(
                          'b',
                          'a',
                          'creation/entities',
                          'a',
                          'fields',
                          'b'
                        );
                        // tslint:disable-next-line:no-shadowed-variable
                        component
                          .applyUpdatesToArrayAsync(
                            array,
                            map,
                            change,
                            subArray,
                            transformToTarget
                          )
                          .then((array) => {
                            expect(array).toEqual(
                              new Array(resultC, resultB, resultA)
                            );
                            expect(map).toEqual(
                              new Map([
                                ['a', 2],
                                ['b', 1],
                                ['c', 0],
                              ])
                            );
                            // Move a before b
                            change = DontCodeTestManager.createMoveChange(
                              'a',
                              'b',
                              'creation/entities',
                              'a',
                              'fields',
                              'a'
                            );
                            // tslint:disable-next-line:no-shadowed-variable
                            component
                              .applyUpdatesToArrayAsync(
                                array,
                                map,
                                change,
                                subArray,
                                transformToTarget
                              )
                              .then((array) => {
                                expect(array).toEqual(
                                  new Array(resultC, resultA, resultB)
                                );
                                expect(map).toEqual(
                                  new Map([
                                    ['a', 1],
                                    ['b', 2],
                                    ['c', 0],
                                  ])
                                );
                                done();
                              })
                              .catch((reason) => {
                                done('Error', reason);
                              });
                          })
                          .catch((reason) => {
                            done(reason);
                          });
                      })
                      .catch((reason) => {
                        done(reason);
                      });
                  })
                  .catch((reason) => {
                    done(reason);
                  });
              })
              .catch((reason) => {
                done(reason);
              });
          })
          .catch((reason) => {
            done(reason);
          });
      })
      .catch((reason) => {
        done(reason);
      });
  }

  it('should manage properly element delete', (done) => {
    testElementDelete(null, done);
  });

  it('should manage properly subArray element delete', (done) => {
    testElementDelete('fields', done);
  });

  function testElementDelete(subArray: string | null, done: DoneCallback) {
    //First creates 3 elements a,b,c
    const map = new Map<string, any>();
    const array = new Array<TestArrayTarget>();
    const resultA = new TestArrayTarget('eltA', 'number');
    const resultB = new TestArrayTarget('eltB', 'string');
    const resultC = new TestArrayTarget('eltC', 'number');

    let change = DontCodeTestManager.createTestChange(
      'creation/entities',
      'a',
      'fields',
      'a',
      resultA
    );
    const provider = new TestProviderInterface(null);
    let entityPointer = provider.calculatePointerFor(
      change.getSafeParentPosition()
    );
    // We are testing for an array as subElement of the entityPointer, not the entityPointer itself
    if (subArray != null) {
      entityPointer = provider.calculatePointerFor(
        entityPointer.containerPosition!
      );
    }
    component.initCommandFlow(provider, entityPointer);
    // tslint:disable-next-line:no-shadowed-variable
    component
      .applyUpdatesToArrayAsync(array, map, change, subArray, transformToTarget)
      .then((array) => {
        change = DontCodeTestManager.createTestChange(
          'creation/entities',
          'a',
          'fields',
          'b',
          resultB
        );
        // tslint:disable-next-line:no-shadowed-variable
        component
          .applyUpdatesToArrayAsync(
            array,
            map,
            change,
            subArray,
            transformToTarget
          )
          .then((array) => {
            change = DontCodeTestManager.createTestChange(
              'creation/entities',
              'a',
              'fields',
              'c',
              resultC
            );
            // tslint:disable-next-line:no-shadowed-variable
            component
              .applyUpdatesToArrayAsync(
                array,
                map,
                change,
                subArray,
                transformToTarget
              )
              .then((array) => {
                expect(array).toHaveLength(3);
                expect(map.get('b')).toBe(1);
                expect(array[1]).toEqual(resultB);

                // Delete b
                change = DontCodeTestManager.createDeleteChange(
                  'creation/entities',
                  'a',
                  'fields',
                  'b'
                );
                // tslint:disable-next-line:no-shadowed-variable
                component
                  .applyUpdatesToArrayAsync(
                    array,
                    map,
                    change,
                    subArray,
                    transformToTarget
                  )
                  .then((array) => {
                    expect(array).toEqual(new Array(resultA, resultC));
                    expect(map).toEqual(
                      new Map([
                        ['a', 0],
                        ['c', 1],
                      ])
                    );
                    // Delete a
                    change = DontCodeTestManager.createDeleteChange(
                      'creation/entities',
                      'a',
                      'fields',
                      'a'
                    );
                    // tslint:disable-next-line:no-shadowed-variable
                    component
                      .applyUpdatesToArrayAsync(
                        array,
                        map,
                        change,
                        subArray,
                        transformToTarget
                      )
                      .then((array) => {
                        expect(array).toEqual(new Array(resultC));
                        expect(map).toEqual(new Map([['c', 0]]));
                        // Reinsert a
                        change = DontCodeTestManager.createTestChange(
                          'creation/entities',
                          'a',
                          'fields',
                          'a',
                          resultA
                        );
                        // tslint:disable-next-line:no-shadowed-variable
                        component
                          .applyUpdatesToArrayAsync(
                            array,
                            map,
                            change,
                            subArray,
                            transformToTarget
                          )
                          .then((array) => {
                            expect(array).toEqual(new Array(resultC, resultA));
                            expect(map).toEqual(
                              new Map([
                                ['c', 0],
                                ['a', 1],
                              ])
                            );
                            // Delete a
                            change = DontCodeTestManager.createDeleteChange(
                              'creation/entities',
                              'a',
                              'fields',
                              'a'
                            );
                            // tslint:disable-next-line:no-shadowed-variable
                            component
                              .applyUpdatesToArrayAsync(
                                array,
                                map,
                                change,
                                subArray,
                                transformToTarget
                              )
                              .then((array) => {
                                expect(array).toEqual(new Array(resultC));
                                expect(map).toEqual(new Map([['c', 0]]));

                                // Delete c
                                change = DontCodeTestManager.createDeleteChange(
                                  'creation/entities',
                                  'a',
                                  'fields',
                                  'c'
                                );
                                // tslint:disable-next-line:no-shadowed-variable
                                component
                                  .applyUpdatesToArrayAsync(
                                    array,
                                    map,
                                    change,
                                    subArray,
                                    transformToTarget
                                  )
                                  .then((array) => {
                                    expect(array).toEqual(new Array());
                                    expect(map).toEqual(new Map());
                                    done();
                                  })
                                  .catch((reason) => {
                                    done(reason);
                                  });
                              })
                              .catch((reason) => {
                                done(reason);
                              });
                          })
                          .catch((reason) => {
                            done(reason);
                          });
                      })
                      .catch((reason) => {
                        done(reason);
                      });
                  })
                  .catch((reason) => {
                    done(reason);
                  });
              })
              .catch((reason) => {
                done(reason);
              });
          })
          .catch((reason) => {
            done(reason);
          });
      })
      .catch((reason) => {
        done(reason);
      });
  }

  function transformToTarget(
    position: DontCodeModelPointer,
    value: any
  ): Promise<TestArrayTarget> {
    return Promise.resolve(new TestArrayTarget(value.name, value.type));
  }

  function createPointer(position: string) {
    return new DontCodeModelPointer(
      position + '/test',
      position + '/test',
      undefined,
      undefined,
      'test',
      true
    );
  }
});

class TestArrayTarget {
  name: string;
  type?: string;

  constructor(name: string, type?: string) {
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
    return new Observable<Change>();
  }

  calculatePointerFor(position: string): DontCodeModelPointer {
    return dtcde.getSchemaManager().generateSchemaPointer(position);
  }

  getSchemaManager(): DontCodeSchemaManager {
    return dtcde.getSchemaManager();
  }

  sendCommand(action: Action): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

@Component({
  template: ``,
})
class TestBaseComponent extends PluginBaseComponent {
  constructor(cls: ComponentLoaderService, inj: Injector, ref: ChangeDetectorRef) {
    super(cls, inj, ref);
  }

  override handleChange(change: Change) {}

  override providesTemplates(): TemplateList {
    return new TemplateList(null, null, null);
  }

  override canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false, false);
  }
}
