import {Component, OnDestroy, OnInit} from '@angular/core';
import {Change, ChangeType} from '@dontcode/core';
import {DevChangePushService} from '../../../shared/dev/services/dev-change-push.service';
import {
  DevStep,
  DevTemplate,
  DevTemplateManagerService,
} from '../../../shared/dev/services/dev-template-manager.service';
import {FormBuilder} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

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
    template: null as DevTemplate|null,
    step: null as DevStep|string|null,
    type: null as string|null,
    value: null as never|string|null
  });
  filteredSteps: Array<DevStep> = [];
  private selectedStep: DevStep | null = null;
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
            if (templ!=null) {
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

            if (typeof step === 'string' ) {
              // The user just changed the step name: We deselect the template
              this.templateForm
                .get('template')?.setValue(null, { emitEvent: false });
                // And we update the step
              if (this.selectedStep!=null) this.selectedStep.position=step;
            } else {
              this.selectedStep=step;
                // Another step has been selected
              if( step!=null) {
                typeControl.setValue(step.type);
                if (typeof step.value === 'string') {
                  valueControl.setValue(step.value);
                } else {
                  valueControl.setValue(JSON.stringify(step.value, null, 2));
                }
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
            if (step!=null) {
              if( value==null) {
                step.value=value;
              } else {
               try {
                  step.value = JSON.parse(value);
                } catch (e: any) {
                  // Not json, so set a string
                  step.value = value;
                }
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
            if (step!=null) {
              step.type = value??'';
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

  async sendCommand() {
    const tmpl = this.getSelectedTemplate();
    if (tmpl!=null) {
      for (const step of tmpl.sequence) {
        if (step.isValid()) {
          await this.pushChange(step.type, step.position, step.value);
        }
      }
    } else {
      const step=this.getSelectedStep();
      if ((step!=null) && (step.isValid())) {
        await this.pushChange(step.type, step.position, step.value);
      }
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

  protected getSelectedTemplate(): DevTemplate|null {
    return this.templateForm.get('template')?.value??null;
  }

  protected getSelectedStep(): DevStep|null{
    return this.selectedStep;
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

  private pushChange(type: string, position: string, valueOrBeforeKey: any) : Promise<void> {
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
    return this.pushService.pushChange(toSend);
  }
}
