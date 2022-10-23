import {Observable} from "rxjs";

/**
 * An interface used by a component to describe what dynamic event it can send
 */
export interface DynamicEventSource {
  name:string;
  type:DynamicEventType;
  eventSource:Observable<DynamicEvent>;
}

export class BaseDynamicEventSource implements DynamicEventSource{

  constructor(public name:string, public type:DynamicEventType, public eventSource:Observable<DynamicEvent>) {
  }
}

export enum DynamicEventType {
  VALUE_CHANGE = 'VALUE_CHANGE',
  SELECTION_CHANGE='SELECTION_CHANGE'
}

/**
 * A dynamic event sent by one component to another
 */
export interface DynamicEvent {
  name:string;
  type:DynamicEventType;
  value:any;
}

export class BaseDynamicEvent implements DynamicEvent{

  constructor(public name:string, public type:DynamicEventType, public value:any) {
  }
}
