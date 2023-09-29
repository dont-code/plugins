import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DontCodeModelManager, DontCodeStoreManager, DontCodeTestManager, dtcde,} from '@dontcode/core';
import {AbstractReferenceComponent, PluginCommonModule} from '@dontcode/plugin-common';

describe('AbstractReferenceComponent', () => {
  let component: TestBaseComponent;
  let fixture: ComponentFixture<TestBaseComponent>;

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

  it('should list the referenced elements', (done) => {
    const core=dtcde.reset();
    const modelMgr = core.getModelManager();

    DontCodeTestManager.addDummyProviderFromContent('creation/entities/ab', [
      {
        'Name': 'Find1',
        'Type': 'TypeFind1'
      },
      {
        'Name': 'Find2',
        'Type': 'TypeFind2'
      }]
    );

    modelMgr.applyChange(DontCodeTestManager.createTestChange('creation', null, 'entities', 'aa', {
      'name':'OtherEntity',
      'fields': {
        'aaa': {
          'name':'OtherName',
          'type': 'Text'
        },
        'aab': {
          'name':'OtherType',
          'type': 'Text'
        }
      }
    }));

    modelMgr.applyChange(DontCodeTestManager.createTestChange('creation', null, 'entities', 'ab', {
      'name':'EntityToFind',
      'fields': {
        'aba': {
          'name':'Name',
          'type': 'Text'
        },
        'abb': {
          'name':'Type',
          'type': 'Text'
        }
      }
    }));

    component.setTargetEntitiesName("EntityToFind").then (value => {
      expect(value).toBeTruthy ();
      expect (component.getTargetEntitiesPos()).toEqual('creation/entities/ab')

      // And list the correct values:
      component.possibleValues().subscribe({
        next: (list)=> {
          expect(list).toHaveLength(2);
          done();
        },
        error: (error) => {
          done (error);
        }
      })
    }).catch(reason => {
      done (reason);
    })

  });

  @Component({
    template: ``,
  })
  class TestBaseComponent extends AbstractReferenceComponent {
    constructor(modelMgr: DontCodeModelManager, storeMgr: DontCodeStoreManager) {
      super(modelMgr, storeMgr);
    }

    setTargetEntitiesName (entityName:string): Promise<boolean> {
      return this.setTargetEntitiesWithName(entityName);
    }

    getTargetEntitiesPos ():string|null {
      return this.targetEntitiesPos;
    }
  }
});
