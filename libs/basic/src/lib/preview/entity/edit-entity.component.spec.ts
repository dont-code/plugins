import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditEntityComponent} from './edit-entity.component';
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {PluginCommonModule} from "@dontcode/plugin-common";
import {Action,
  Change,
  CommandProviderInterface,
  DontCodeModelPointer,
  DontCodeSchemaManager,
  dtcde
} from '@dontcode/core';
import {Observable} from 'rxjs';

describe('EditEntityComponent', () => {
  let component: EditEntityComponent;
  let fixture: ComponentFixture<EditEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEntityComponent],
      imports: [CheckboxModule, FormsModule, InputNumberModule, InputTextModule, ReactiveFormsModule, PluginCommonModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.initCommandFlow(new FakeProvider(), new DontCodeModelPointer("creation/entities", "creation/entities"));
    expect(component).toBeTruthy();
  });
});

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
