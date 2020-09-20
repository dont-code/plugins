import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommandProviderInterface, DontCodeModelPointer, PreviewHandler } from "@dontcode/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'plugins-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit, OnDestroy, PreviewHandler {

  unsubscriber = new Subject();

  constructor() { }

  ngOnInit(): void {
  }

  initCommandFlow(provider: CommandProviderInterface, pointer: DontCodeModelPointer) {
//    console.log("InitCommandFlow");
    provider.receiveCommands(pointer.position).pipe(
      takeUntil(this.unsubscriber)
    ).subscribe(change => {
      console.log("Getting updates from ", pointer.position, " with value ", change.value);
    });
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe ();
  }

  forceUnsubscribe (): void {
    // unsubscribe to all observables
//    console.log("Unsubscribe");
    this.unsubscriber.next();
    this.unsubscriber.complete();
    this.unsubscriber = new Subject();
  }

}
