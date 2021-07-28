import { CommandProviderInterface, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";

@Component({
  selector: 'dontcode-sandbox-default-viewer',
  templateUrl: './default-viewer.component.html',
  styleUrls: ['./default-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultViewerComponent implements OnInit, PreviewHandler {

  position: string|null=null;
  schemaPosition: string|null=null;

  constructor(protected ref:ChangeDetectorRef) {
    }


  ngOnInit(): void {
  }

  initCommandFlow(provider: CommandProviderInterface, pointer:DontCodeModelPointer) {
    this.position = pointer.position;
    this.schemaPosition = pointer.schemaPosition;
    this.ref.detectChanges();
  }


}
