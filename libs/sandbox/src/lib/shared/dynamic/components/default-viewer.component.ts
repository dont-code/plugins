import { CommandProviderInterface, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: 'preview-ui-default-viewer',
  templateUrl: './default-viewer.component.html',
  styleUrls: ['./default-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultViewerComponent implements OnInit, PreviewHandler {

  position: string|null=null;
  schemaPosition: string|null=null;

  constructor() {
    }


  ngOnInit(): void {
  }

  initCommandFlow(provider: CommandProviderInterface, pointer:DontCodeModelPointer) {
    this.position = pointer.position;
    this.schemaPosition = pointer.schemaPosition;
  }


}
