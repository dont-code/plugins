import {Injectable} from '@angular/core';
import {Change} from "@dontcode/core";
import {BroadcastChannel} from 'broadcast-channel';
import {ChangeListenerService} from '../../change/services/change-listener.service';
import {CHANNEL_CHANGE_NAME} from "@dontcode/plugin-common";


@Injectable({
  providedIn: 'root'
})
export class DevChangePushService {

  protected channel: BroadcastChannel<Change>;

  constructor(protected listener:ChangeListenerService) {
    // console.log('Creating debug broadcast');
    this.channel = new BroadcastChannel(CHANNEL_CHANGE_NAME);
  }

  pushChange (toPush:Change): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    // console.debug('Dev pushing change for ', toPush.position);
    return this.listener.internalPushChange(toPush);
  }


}
