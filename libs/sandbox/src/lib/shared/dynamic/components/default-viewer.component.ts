import {CommandProviderInterface, DontCodeModelPointer} from "@dontcode/core";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector} from "@angular/core";
import {ComponentLoaderService, PluginBaseComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";

@Component({
  selector: 'dontcode-sandbox-default-viewer',
  templateUrl: './default-viewer.component.html',
  styleUrls: ['./default-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultViewerComponent extends PluginBaseComponent {

  position: string|null=null;
  schemaPosition: string|null=null;

  constructor(loader: ComponentLoaderService, injector:Injector, protected ref:ChangeDetectorRef) {
    super(loader, injector);
  }

  initCommandFlow(provider: CommandProviderInterface, pointer:DontCodeModelPointer) {
    this.position = pointer.position;
    this.schemaPosition = pointer.schemaPosition;
    this.ref.detectChanges();
  }

  canProvide(key?: string): PossibleTemplateList {
    throw new Error('Unsupported');
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error('Unsupported');
  }


}
