import { Component, OnDestroy, OnInit } from '@angular/core';
import { Change, ChangeType } from '@dontcode/core';
import { DevChangePushService } from '../../../shared/dev/services/dev-change-push.service';
import {
  DevTemplate,
  DevTemplateManagerService,
} from '../../../shared/dev/services/dev-template-manager.service';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dontcode-sandbox-insert-command',
  templateUrl: './insert-command.component.html',
  styleUrls: ['./insert-command.component.css'],
})
export class InsertCommandComponent implements OnInit, OnDestroy {
  position = 'creation/name';
  value = 'New Test';

  subscriptions = new Subscription();

  listTemplates: DevTemplate[] = [];
  filteredTemplates: DevTemplate[] = [];
  templateForm = this.fb.group({
    template: [null],
    step: [null],
    type: [null],
    position: [''],
    value: [null],
  });
  filteredSteps: Array<{ position: string; value: any }> = [];
  valueFieldLabel = 'Value';
  changeTypes = [
    { label: ChangeType.ADD },
    { label: ChangeType.UPDATE },
    { label: ChangeType.DELETE },
    { label: ChangeType.MOVE },
    { label: ChangeType.RESET },
  ];
  openAddCommand = true;

  constructor(
    protected pushService: DevChangePushService,
    protected templates: DevTemplateManagerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.templates
        .getTemplates()
        .pipe(
          map((allTemplates) => {
            this.listTemplates = allTemplates;
          })
        )
        .subscribe()
    );

    this.subscriptions.add(
      this.templateForm
        .get('template')
        ?.valueChanges.pipe(
          map((templ) => {
            const stepControl = this.templateForm.get('step');
            const typeControl = this.templateForm.get('type');
            if( (stepControl==null)||(typeControl==null))
              throw new Error("Cannot find value and type field");
            if (templ instanceof DevTemplate && templ.sequence) {
              this.filteredSteps = templ.sequence;
              stepControl.setValue(templ.sequence[0]);
              stepControl.enable({ emitEvent: false });
              typeControl.setValue(templ.sequence[0].type);
            } else {
              stepControl.setValue(null);
              stepControl.disable({ emitEvent: false });
              typeControl.setValue(null);
            }
          })
        )
        .subscribe()
    );

    this.subscriptions.add(
      this.templateForm
        .get('step')
        ?.valueChanges.pipe(
          map((step) => {
            const valueControl = this.templateForm.get('value');
            const typeControl = this.templateForm.get('type');

            if( (valueControl==null)||(typeControl==null))
              throw new Error("Cannot find value and type field");

            if (step === null) {
              valueControl.disable({ emitEvent: false });
              typeControl.disable({ emitEvent: false });
            } else {
              valueControl.enable({ emitEvent: false });
              typeControl.enable({ emitEvent: false });
            }

            if (typeof step === 'string' || step instanceof String) {
              //          valueControl.setValue(null);
              this.templateForm
                .get('template')?.setValue(null, { emitEvent: false });
            } else {
              typeControl.setValue(step.type);
              if (
                typeof step.value === 'string' ||
                step.value instanceof String
              ) {
                valueControl.setValue(step.value);
              } else {
                valueControl.setValue(JSON.stringify(step.value, null, 2));
              }
            }
          })
        )
        .subscribe()
    );
    this.subscriptions.add(
      this.templateForm
        .get('value')
        ?.valueChanges.pipe(
          map((value) => {
            const step = this.getSelectedStep();
            if (step) {
              if (typeof step === 'string' || step instanceof String) {
                return;
              }
              try {
                step.value = JSON.parse(value);
              } catch (e: any) {
                // Not json, so set a string
                step.value = value;
              }
            }
          })
        )
        .subscribe()
    );
    this.subscriptions.add(
      this.templateForm
        .get('type')
        ?.valueChanges.pipe(
          map((value) => {
            const step = this.getSelectedStep();
            if (step) {
              if (typeof step === 'string' || step instanceof String) {
                return;
              }
              step.type = value;
            }
            if (value === ChangeType.MOVE) {
              this.valueFieldLabel = 'Before';
            } else {
              this.valueFieldLabel = 'Value';
            }
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendCommand() {
    const tmpl = this.getSelectedTemplate();
    if (tmpl?.sequence) {
      tmpl.sequence.forEach((step) => {
        this.pushChange(step.type, step.position, step.value);
      });
    } else {
      // It's just a step, not from any template
      const step = this.getSelectedStep();
      // Is the value Json or not ?
      let jsonVal = this.templateForm.get('value')?.value;
      try {
        jsonVal = JSON.parse(jsonVal);
      } catch (error) {
        console.log('Value is not json ', jsonVal, error);
      }
      this.pushChange(
        this.templateForm.get('type')?.value,
        step as string,
        jsonVal
      );
    }
  }

  searchTemplate($event: any) {
    this.subscriptions.add(
      this.templates.filterTemplates($event.query).pipe(
        map((list) => {
          this.filteredTemplates = list;
        })
      ).subscribe()
    );
  }

  protected getSelectedTemplate(): DevTemplate {
    return this.templateForm.get('template')?.value;
  }

  protected getSelectedStep(): { position: string; type: string; value: any } | string {
    return this.templateForm.get('step')?.value;
  }

  searchStep($event: any) {
    const query = $event.query.toLowerCase();
    const seq = this.getSelectedTemplate()?.sequence;
    if (seq) {
      this.filteredSteps = seq.filter((step) => {
        if (step.position.toLowerCase().startsWith(query)) {
          return true;
        } else return false;
      });
    } else {
      this.filteredSteps = [];
    }
  }

  private pushChange(type: string, position: string, valueOrBeforeKey: any) {
    if (position === '/') position = '';
    const toSend = new Change(
      ChangeType[type as keyof typeof ChangeType],
      position,
      valueOrBeforeKey
    );
    if (type === ChangeType.MOVE) {
      toSend.value = null;
      toSend.oldPosition = position;
      toSend.beforeKey = valueOrBeforeKey as string;
    }
    this.pushService.pushChange(toSend);
  }
}
