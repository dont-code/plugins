import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {combineLatest, EMPTY, Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ChangeProviderService} from "../../shared/command/services/change-provider.service";
import {ChangeListenerService} from "../../shared/change/services/change-listener.service";
import {DontCodeModel} from "@dontcode/core";
import {SANDBOX_CONFIG, SandboxLibConfig} from "../../shared/config/sandbox-lib-config";

@Component({
  selector: 'dontcode-sandbox-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

  context$: Observable<{
    status:string,
    sessionId:string
  }> = EMPTY;

  protected subscriptions = new Subscription();

  appName = 'No Name';

  sidePanelVisible: boolean;
  serverUrl = '';

  constructor(
    @Inject(SANDBOX_CONFIG) private config:SandboxLibConfig,
    protected provider:ChangeProviderService,
    protected listenerService:ChangeListenerService,
    private ref: ChangeDetectorRef
  ) {
    this.sidePanelVisible = true;
  }

  ngOnInit() {
    this.serverUrl = this.config.webSocketUrl;
    this.subscriptions.add(this.provider.receiveCommands (DontCodeModel.APP_NAME).subscribe(command => {
      if( command.value) {
        this.appName = command.value;
      } else {
        this.appName = 'No Name';
      }
        this.ref.detectChanges();
    }));
    this.context$ = combineLatest([this.listenerService.getConnectionStatus(), this.listenerService.getSessionIdSubject()])
      .pipe(map ((status) => {
        return {status:status[0], sessionId:status[1]};
      }));
  }
  ngOnDestroy() {
      // unsubscribe to all observables
    this.subscriptions.unsubscribe();
  }

  logoClicked() {
    this.sidePanelVisible=true;
  }

  sidePanelVisibleChanged($event: any) {
    //console.log($event);
    this.sidePanelVisible=$event.target.visible;
  }

  openDevUrl() {
    window.open('#/newTabDev', '_blank');
  }

  connectedClass(ctx: { status: string }): string {
    if( ctx.status!=="connected") {
      return "p-button-danger";
    }else
      return '';
  }
}
