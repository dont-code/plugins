import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit} from "@angular/core";
import {combineLatest, EMPTY, Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ChangeProviderService} from "../../shared/command/services/change-provider.service";
import {ChangeListenerService} from "../../shared/change/services/change-listener.service";
import {DontCodeModel} from "@dontcode/core";
import {CommonLibConfig, CommonConfigService} from "@dontcode/plugin-common";

@Component({
  selector: 'dontcode-sandbox-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {

  context$: Observable<{
    status:string,
    sessionId:string|undefined
  }> = EMPTY;

  protected subscriptions = new Subscription();

  appName = 'Plugin Tester';

  sidePanelVisible: boolean;
  serverUrl = '';
  config: CommonLibConfig|null =null;

  constructor(
    protected provider:ChangeProviderService,
    protected listenerService:ChangeListenerService,
    protected configService: CommonConfigService,
    private ref: ChangeDetectorRef
  ) {
    this.sidePanelVisible = true;
  }

  ngOnInit() {
    this.subscriptions.add(this.configService.getUpdates().subscribe( (newConfig) => {
      if ((newConfig.applicationName!=this.config?.applicationName)
       && (newConfig.applicationName!=null)) {
        this.appName = newConfig.applicationName;
      }

      if ((newConfig.webSocketUrl!=this.config?.webSocketUrl)
       && (newConfig.webSocketUrl!=null)
      && (newConfig.webSocketUrl.length>0)) {
        this.serverUrl=newConfig.webSocketUrl;
      }
      this.config=newConfig;

    }));

    this.subscriptions.add(this.provider.receiveCommands (DontCodeModel.APP_NAME).subscribe(command => {
      if( command.value) {
        this.appName = this.generateApplicationName (command.value);
      } else {
        this.appName = this.generateApplicationName ('No Name');
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
    if( ctx.status==="undefined") {
      return "p-button-secondary";
    }
    else if( ctx.status!=="connected") {
      return "p-button-danger";
    }else
      return '';
  }

  protected generateApplicationName(subName: string) {
    if (this.config?.applicationName) {
      return this.config?.applicationName+' '+subName;
    } else {
      return subName;
    }
  }

  themedLogo() : string {
    if (this.config?.theme) {
      return 'assets/images/logo-'+this.config?.theme+'.png';
    } else {
      return 'assets/images/logo.png';
    }
  }
}
