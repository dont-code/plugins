import {Observable} from "rxjs";

export interface DynamicEventSource {
  name:string;
  type:DynamicEventType;
  eventSource:Observable<DynamicEvent>;
}

export enum DynamicEventType {
  VALUE_CHANGE = 'CHANGE',
  SELECTION_CHANGE='SELECTION_CHANGE'
}

export interface DynamicEvent {
  name:string;
  type:DynamicEventType;
  value:any;
}
