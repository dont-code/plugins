import { Injectable } from '@angular/core';
import { Change } from "@dontcode/core";
import { BroadcastChannel } from 'broadcast-channel';


@Injectable({
  providedIn: 'root'
})
export class DevChangePushService {

  public static readonly CHANNEL_CHANGE_NAME='preview-ui-changes';
  protected channel: BroadcastChannel<Change>;

  constructor() {
    // console.log('Creating debug broadcast');
    this.channel = new BroadcastChannel(DevChangePushService.CHANNEL_CHANGE_NAME);
  }

  pushChange (toPush:Change): void {
    //console.log('Pushing changes');
    this.channel.postMessage(toPush);
  }


}
