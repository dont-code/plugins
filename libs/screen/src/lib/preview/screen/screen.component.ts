import {Component, OnDestroy} from '@angular/core';
import {Change, CommandProviderInterface, DontCodeModelPointer, PreviewHandler,} from '@dontcode/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'plugins-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
})
export class ScreenComponent implements OnDestroy, PreviewHandler {
  unsubscriber = new Subscription();

  constructor() {}

  initCommandFlow(
    provider: CommandProviderInterface,
    pointer: DontCodeModelPointer
  ) {
    //    console.log("InitCommandFlow");
    this.unsubscriber.add(
      provider.receiveCommands(pointer.position).subscribe((change) => {
        console.log(
          'Getting updates from ',
          pointer.position,
          ' with value ',
          change.value
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe();
  }

  forceUnsubscribe(): void {
    // unsubscribe to all observables
    //    console.log("Unsubscribe");
    this.unsubscriber.unsubscribe();
  }

  handleChange(change: Change): void {
    // No need to update anything
  }
}
