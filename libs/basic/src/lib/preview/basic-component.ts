import { Subject } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Change } from "@dontcode/core";

@Component({template:''})
export abstract class BasicComponent implements OnInit, OnDestroy {
  protected unsubscriber = new Subject();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe();
  }

  protected forceUnsubscribe(): void {
    // unsubscribe to all observables
//    console.log("Unsubscribe");
    this.unsubscriber.next();
    this.unsubscriber.complete();
    this.unsubscriber = new Subject();
  }

  decodeStringField(change: Change, key: string): string {
    if (change.pointer.key === key) {
      return change.value;
    } else
      return undefined;
  }

  decodeArrayField(change: Change, key: string): any[] {
    if (change.pointer.key === key) {
      return change.value;
    } else
      return undefined;
  }
}
