import {Inject, Injectable, Optional} from "@angular/core";
import {Change, Message, MessageType} from "@dontcode/core";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {WebSocketSubject} from "rxjs/internal-compatibility";
import {webSocket} from "rxjs/webSocket";
import {BroadcastChannel} from "broadcast-channel";
import {DevChangePushService} from "../../dev/services/dev-change-push.service";
import {SANDBOX_CONFIG, SandboxLibConfig} from "../../config/sandbox-lib-config";


@Injectable({
  providedIn: 'root'
})
export class ChangeListenerService {

  protected listOfChanges: Change[]=[];

//  protected listOfEntities: Map<string, string> = new Map();

  previewServiceWebSocket?: WebSocketSubject<Message>;
  protected changeEmitter = new Subject<Change> ();
  protected connectionStatus: ReplaySubject<string>=new ReplaySubject<string>(1);

  protected sessionId: string|null = null;
  protected sessionIdSubject: ReplaySubject<string>=new ReplaySubject<string>(1);

  protected channel: BroadcastChannel<Change>;

  constructor(@Optional() @Inject(SANDBOX_CONFIG) private config?:SandboxLibConfig) {
    if ((this.config) && (this.config.webSocketUrl)&&(this.config.webSocketUrl.length>0)) {
      this.previewServiceWebSocket = webSocket(this.config.webSocketUrl);
      this.connectionStatus.next("connected");
      this.previewServiceWebSocket.subscribe(
        msg => {
          //console.log('message received: ' + msg);
          if( msg.type===MessageType.CHANGE) {
            if (msg.change) {
              this.listOfChanges.push(msg.change);
              this.changeEmitter.next(msg.change);
            } else {
              console.error ('Received change message without a change...');
            }
          }
        },
        // Called whenever there is a message from the server
        err => {
          //console.log(err);
          this.connectionStatus.next("ERROR:"+err);
          this.sessionIdSubject.next();

        },
        // Called if WebSocket API signals some kind of error
        () => {
          //console.log('complete');
          this.connectionStatus.next("closed");
          this.sessionIdSubject.next();
        }
        // Called when connection is closed (for whatever reason)
      );
    } else {
      console.log("No SANDBOX_CONFIG injected => Not listening to changes from servers");
      this.connectionStatus.next("undefined");
      this.sessionIdSubject.next();
    }

    // Listens as well to broadcasted events
    // console.log("Listening to debug broadcasts")
    this.channel = new BroadcastChannel(DevChangePushService.CHANNEL_CHANGE_NAME);
    this.channel.onmessage = msg => {
      this.listOfChanges.push(msg);
      this.changeEmitter.next(msg);
    }
  }

  getListOfChanges (): Change[] {
    return this.listOfChanges;
  }

  getChangeEvents (): Observable<Change> {
    return this.changeEmitter;
  }
  getConnectionStatus (): Observable<string> {
    return this.connectionStatus;
  }

  setSessionId (newId:string|null): void {
    this.sessionId=newId;
    this.sessionIdSubject.next(newId?newId:undefined);
    if (this.previewServiceWebSocket) {
      this.previewServiceWebSocket.next(new Message(MessageType.INIT, newId?newId:undefined));
    }
  }

  getSessionId (): string|null  {
    return this.sessionId;
  }

  getSessionIdSubject(): Observable<string> {
    return this.sessionIdSubject;
  }

}
