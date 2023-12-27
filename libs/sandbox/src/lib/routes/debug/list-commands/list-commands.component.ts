import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Change } from "@dontcode/core";
import { ChangeProviderService } from "../../../shared/command/services/change-provider.service";

@Component({
  selector: 'dontcode-sandbox-list-commands',
  templateUrl: './list-commands.component.html',
  styleUrls: ['./list-commands.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListCommandsComponent implements OnInit, OnDestroy {
  protected subscriptions = new Subscription();

  commands: Change[] = [];

  /**
   * Dont update for the first item sent by providerservice
   */
  protected forgetIt = true;


  constructor(    protected changeProvider:ChangeProviderService,
                  protected ref:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscriptions.add(this.changeProvider.getChangesHistory()
      .pipe(
        map ((command) => {
        // console.log('Received...', command);
          this.commands.push(structuredClone (command));
          this.ref.detectChanges();
//        }
      })).subscribe());
  }

  noCommands(): boolean {
    return  this.commands.length==0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

}
