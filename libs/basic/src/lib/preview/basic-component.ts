import { Subject } from "rxjs";

export class BasicComponent {
  protected unsubscriber = new Subject();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.forceUnsubscribe ();
  }

  protected forceUnsubscribe (): void {
    // unsubscribe to all observables
//    console.log("Unsubscribe");
    this.unsubscriber.next();
    this.unsubscriber.complete();
    this.unsubscriber = new Subject();
  }


}
