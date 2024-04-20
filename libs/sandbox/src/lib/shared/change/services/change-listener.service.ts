import { Injectable } from '@angular/core';
import { Change, ChangeType, Message, MessageType } from '@dontcode/core';
import {firstValueFrom, map, Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { webSocket } from 'rxjs/webSocket';
import { BroadcastChannel } from 'broadcast-channel';
import {
  CHANNEL_CHANGE_NAME,
  CommonLibConfig,
  CommonConfigService,
} from '@dontcode/plugin-common';
import { HttpClient } from '@angular/common/http';
import { IdeProject } from './IdeProject';

@Injectable({
  providedIn: 'root',
})
export class ChangeListenerService {
  protected listOfChanges: Change[] = [];

  //  protected listOfEntities: Map<string, string> = new Map();

  previewServiceWebSocket: WebSocketSubject<Message> | null = null;
  socketSubscription : Subscription|null=null;
  projectUrl?: string;
  protected changeEmitter = new Subject<Change>();
  protected connectionStatus: ReplaySubject<string> = new ReplaySubject<string>(1);
  protected config: CommonLibConfig | null = null;

  protected sessionId: string | null = null;
  protected sessionIdSubject: ReplaySubject<string|undefined> = new ReplaySubject<string|undefined>(
    1
  );

  protected channel: BroadcastChannel<Change>|undefined;

  constructor(
    protected http: HttpClient,
    protected configService: CommonConfigService
  ) {
    try {

      this.configService.getUpdates().subscribe((newConfig) => {
        const socketChanged = newConfig.webSocketUrl!=this.config?.webSocketUrl;
        this.config=newConfig;
        if ((newConfig.projectApiUrl!=null) && (newConfig.projectApiUrl.length>0))
          this.projectUrl=newConfig.projectApiUrl;
        if (socketChanged) this.initializeSocket (newConfig.webSocketUrl);
      });

      // Listens as well to broadcasted events
      // console.log("Listening to debug broadcasts")
      this.channel = new BroadcastChannel(
        CHANNEL_CHANGE_NAME, {}
      );
      this.channel.onmessage = (msg) => {
        // eslint-disable-next-line no-restricted-syntax
        // console.debug("Received broadcasted change at "+msg.position);
        this.listOfChanges.push(msg);
        this.changeEmitter.next(msg);
      };
    } catch ( err) {
      console.error("Error initializing ChangeListnerService", err);
    }
  }

  protected initializeSocket (webSocketUrl:string | undefined) {
    if ( (this.previewServiceWebSocket!=null) && (this.socketSubscription != null)) {
      this.socketSubscription.unsubscribe();
      this.socketSubscription=null;
      this.previewServiceWebSocket.complete();  // Close subscription
      this.previewServiceWebSocket=null;
      this.connectionStatus.next('closed');
    }

    if ((webSocketUrl!=null && (webSocketUrl.length>0))) {
      this.previewServiceWebSocket = webSocket(webSocketUrl);
      this.connectionStatus.next('connected');
      this.socketSubscription= this.previewServiceWebSocket?.subscribe({
          next: (msg) => {
            //console.log('message received: ' + msg);
            if (msg.type === MessageType.CHANGE) {
              if (msg.change) {
                this.listOfChanges.push(msg.change);
                this.changeEmitter.next(msg.change);
              } else {
                console.error('Received change message without a change...');
              }
            }
          },
          // Called whenever there is a message from the server
          error: (err) => {
            //console.log(err);
            this.connectionStatus.next('ERROR:' + err);
            this.sessionIdSubject.next(undefined);
          },
          // Called if WebSocket API signals some kind of error
          complete: () => {
            //console.log('complete');
            this.connectionStatus.next('closed');
            this.sessionIdSubject.next(undefined);
          }
        }
        // Called when connection is closed (for whatever reason)
      );
    } else {
      console.warn(
        'No SANDBOX_CONFIG WebSocketUrl injected => Not listening to changes from servers'
      );
      this.connectionStatus.next('undefined');
      this.sessionIdSubject.next(undefined);
    }

  }

  getListOfChanges(): Change[] {
    return this.listOfChanges;
  }

  getChangeEvents(): Observable<Change> {
    return this.changeEmitter;
  }
  getConnectionStatus(): Observable<string> {
    return this.connectionStatus;
  }

  setSessionId(newId: string | null): void {
    this.sessionId = newId;
    this.sessionIdSubject.next(newId ? newId : undefined);
    if (this.previewServiceWebSocket) {
      this.previewServiceWebSocket.next(
        new Message(MessageType.INIT, newId ? newId : undefined)
      );
    }
  }

  loadProject(projectId: string): Promise<IdeProject> {
    if (this.sessionId) {
      throw new Error(
        'Cannot load a project while in a session with Builder. Please load the project '
      );
    }

    if (this.projectUrl) {
      return firstValueFrom(this.http
        .get<IdeProject>(
          this.projectUrl + '/' + encodeURIComponent(projectId),
          { responseType: 'json' }
        ).pipe(
          map((project) => {
            // Create a new Reset change
            const resetChange = new Change(ChangeType.RESET, '', project.content);
            this.listOfChanges.push(resetChange);
            this.changeEmitter.next(resetChange);
            return project;
        })
        )
      );
    } else {
      return Promise.reject(
        new Error(
          'Cannot call project api as No projectUrl provided in SANDBOX_CONFIG'
        )
      );
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  getSessionIdSubject(): Observable<string|undefined> {
    return this.sessionIdSubject;
  }

  internalPushChange (toPush:Change): Promise<void> {
    this.listOfChanges.push(toPush);
    this.changeEmitter.next(toPush);
    return Promise.resolve();
  }
}
