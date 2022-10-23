import {ChangeDetectorRef, Component, Injector, Input, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer,} from '@dontcode/core';
import {
  ComponentLoaderService,
  PluginBaseComponent,
  PossibleTemplateList, SubFieldInfo,
  TemplateList,
} from '@dontcode/plugin-common';
import {FormBuilder, FormGroup,} from '@angular/forms';

@Component({
  selector: 'dontcode-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss'],
})
export class EditEntityComponent extends PluginBaseComponent implements OnInit {
  @Input('value') set _value(newVal: any) {
    this.setValue(newVal);
  }

  @ViewChild('defaulteditor')
  private defaultTemplate!: TemplateRef<any>;

  //initing = false;
  //formConfig = {};

  constructor(
    ref: ChangeDetectorRef,
    protected fb: FormBuilder,
    injector: Injector,
    componentLoader: ComponentLoaderService
  ) {
    super(componentLoader, injector, ref);
  }

  ngOnInit(): void {
    this.form = this.fb.group({}, { updateOn: 'blur' });
    this.updateValueOnFormChanges ();
  }

  override initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ): any {
    //this.initing=true;
    super.initCommandFlow(provider, pointer);

    if (!this.entityPointer)
      throw new Error(
        'Cannot listen to changes without knowing a base position'
      );
    this.decomposeJsonToMultipleChanges(
      this.entityPointer,
      provider.getJsonAt(this.entityPointer.position)
    ); // Dont provide a special handling for initial json, but emulate a list of changes
    this.initChangeListening(true); // Listen to all changes occuring after entityPointer
    //this.initing=false;
    this.rebuildForm();
  }

  /**
   * Updates the edit form whenever the fields of the entity are changed
   * @param change
   * @protected
   */
  override handleChange(change: Change) {
    if (change.position !== this.entityPointer?.position) {
      this.updateSubFieldsWithChange(change, null).then(value => {
        if (value != null) {
          this.ref.markForCheck();
          this.ref.detectChanges();
        }
      })
    }
  }

  providesTemplates(): TemplateList {
    return new TemplateList(null, null, null);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false, false);
  }

  templateOf(field: SubFieldInfo): TemplateRef<any> {
    let ref = field.component?.providesTemplates(field.type).forFullEdit;
    if (!ref) ref = this.defaultTemplate;

    return ref;
  }

  override setForm(form: FormGroup) {
    // Just ignore any form set
    if (form) {
      throw new Error(
        'Trying to set a form to the Edit Entity component who already has one'
      );
    }
  }

  isShortText(fieldName: string): boolean {
    const val = this.form.get(fieldName)?.value as string;
    if( val!=null)
      return val.length<50;
    else
      return true;
  }

  override getValue(): any {
    return super.getValue();
  }
}
