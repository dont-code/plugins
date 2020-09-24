import { Component } from "@angular/core";
import { CommandProviderInterface, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { takeUntil } from "rxjs/operators";
import { BasicComponent } from "../basic-component";

@Component({
  selector: 'dontcode-basic-entity',
  templateUrl: './basic-entity.component.html',
  styleUrls: ['./basic-entity.component.scss']
})
export class BasicEntityComponent extends BasicComponent implements PreviewHandler {


  ngOnInit(): void {
    super.ngOnInit();
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer): any {
    provider.receiveCommands(pointer.position).pipe(
      takeUntil(this.unsubscriber)
    ).subscribe(change => {
      console.log("Getting updates from ", pointer.position, " with value ", change.value);
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
