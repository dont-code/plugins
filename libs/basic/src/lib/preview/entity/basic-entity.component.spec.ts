import 'core-js/stable/structured-clone'; // Some bugs in Jest disable the native call
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditEntityComponent} from './edit-entity.component';
import {ReactiveFormsModule} from "@angular/forms";
import {
  COMMAND_PROVIDER,
  CommonTestManager,
  ComponentLoaderService,
  PluginBaseComponent,
  PluginCommonModule,
  PossibleTemplateList,
  TemplateList
} from "@dontcode/plugin-common";
import {
  Action,
  ActionHandler,
  Change,
  CommandProviderInterface,
  DontCodeEntityType,
  DontCodeModelPointer,
  DontCodeSchemaManager,
  DontCodeTestManager,
  dtcde
} from '@dontcode/core';
import {Observable, Subject} from 'rxjs';
import {BasicEntityComponent} from "@dontcode/plugin-basic";
import {ToolbarModule} from "primeng/toolbar";
import {TabViewModule} from "primeng/tabview";
import {ListEntityComponent} from "./list-entity.component";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {ChangeDetectorRef, Component, Injector, TemplateRef, ViewChild} from "@angular/core";
import {ChangeProviderService} from "@dontcode/sandbox";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('BasicEntityComponent', () => {
  let component: BasicEntityComponent;
  let fixture: ComponentFixture<BasicEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicEntityComponent, ListEntityComponent, EditEntityComponent],
      imports: [HttpClientTestingModule,ToolbarModule, TabViewModule, TableModule, TooltipModule, ReactiveFormsModule, PluginCommonModule.forRoot()],
      providers: [{provide:COMMAND_PROVIDER, useClass: ChangeProviderService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicEntityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    DontCodeTestManager.addDummyProviderFromContent("creation/entities/a", {});
    component.initCommandFlow(new FakeProvider(), new DontCodeModelPointer("creation/entities/a", "creation/entities"));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run refresh action', (done) => {
    dtcde.getModelManager().resetContent({
      creation: {
        name:'ActionTestApp',
        entities: {
          b:ENTITY
        }
      }

    });

    DontCodeTestManager.addDummyProviderFromContent("creation/entities/b", [{
      name:'Test1',
      action:'Action1'
    },{
      name:'Test2',
      action:'Action2'
    }]);
    CommonTestManager.registerComponentForType('ActionTestType', 'ActionTest', ActionTestComponent);

    component.initCommandFlow(TestBed.inject(ChangeProviderService), new DontCodeModelPointer("creation/entities/b", "creation/entities"));
    fixture.detectChanges();
    expect(component).toBeTruthy();

    fixture.whenStable().then(() => {
      component.refreshScreen().then ( ()=> {
          done();
        }
      ).catch(reason => {
        done(reason);
      });
    });
  });

});

const ENTITY: DontCodeEntityType = {
  name:'ActionTestEntity',
  fields: {
    'ba': {
      name:'Name',
      type: 'Text'
    },
    'bb': {
      name:'action',
      type:'ActionTestType'
    }
  }
}

@Component({
  selector: 'test-action-component',
  template: '<ng-template #inlineView>Action Test Component</ng-template>'
})
export class ActionTestComponent extends PluginBaseComponent implements ActionHandler{

  @ViewChild('inlineView', {static: true})
  private inlineView!: TemplateRef<any>;

  constructor(loader: ComponentLoaderService, injector: Injector, ref: ChangeDetectorRef) {
    super(loader, injector, ref);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false ,false);
  }

  providesTemplates(key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, null);
  }

  handleChange(change: Change): void {
  }

  performAction(action: Action): Promise<void> {
//    console.debug("Action called");
//    ActionTestComponent.actionCalled.complete();
    return Promise.resolve(undefined);
  }

}

class FakeProvider implements CommandProviderInterface {

    receiveCommands(position?: string, lastItem?: string): Observable<Change> {
        return new Observable<Change>();
    }
    getJsonAt(position: string) {
        return {};
    }
    getSchemaManager(): DontCodeSchemaManager {
        return dtcde.getSchemaManager();
    }
    calculatePointerFor(position: string): DontCodeModelPointer {
        return new DontCodeModelPointer(position, position);
    }
    sendCommand(action: Action): Promise<void> {
      throw new Error('Method not implemented.');
    }
}
