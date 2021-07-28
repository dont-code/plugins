import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {Change, ChangeType, DontCodeModel} from "@dontcode/core";
import {Router} from "@angular/router";
import {MenuItem} from 'primeng/api';
import {ChangeProviderService} from "../../shared/command/services/change-provider.service";

@Component({
  selector: 'dontcode-sandbox-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit, OnDestroy {

  menus:Array<MenuItem>;
  templateMenus =new Array<MenuItem> (
    {label:'Main Menu', items:[
        {label:'Home', icon:'pi pi-home', routerLink:['/']},
        {label:'Dev', icon:'pi pi-book', routerLink: ['dev']}
      ]},
    {label:'Application Menu', items:new Array<any>()}
  );
  subscriptions = new Subscription();

  constructor(protected provider: ChangeProviderService,
              private ref: ChangeDetectorRef, public router: Router,
              public ngZone:NgZone) {
    this.menus = this.generateMenu ();
  }

  ngOnInit(): void {
    this.handleEntitiesMenu (DontCodeModel.APP_ENTITIES, DontCodeModel.APP_ENTITIES_NAME_NODE, 'pi-ticket');
    this.handleEntitiesMenu (DontCodeModel.APP_SCREENS, DontCodeModel.APP_SCREENS_NAME_NODE, 'pi-desktop');
  }

  handleEntitiesMenu (entity:string, nameKey:string, icon:string) {
   this.subscriptions.add (this.provider.receiveCommands (entity, nameKey).pipe (
      map(command => {
        this.updateMenuName (command, icon);
        this.ref.detectChanges();
      })
    ).subscribe());
    this.subscriptions.add (this.provider.receiveCommands (entity+"/?").pipe (
      map(command => {
        if (command.position.length>(entity.length+1))  // Avoid adding empty entities (received due to reset)
        {
          this.updateMenu (command, icon);
          this.ref.detectChanges();
        } else if (!command.value) {
          // Reset all menus
          this.getDynamicMenu().length=0;
          this.ref.detectChanges();
        }
      })
    ).subscribe());
  }

  getDynamicMenu (): Array<MenuItem> {
    if( this.templateMenus[1].items)
      return this.templateMenus[1].items;
    else
      return [];
  }

  generateMenu (): Array<any> {
    // Create a new menu object to update UI
    const ret= new Array<any>();
    this.templateMenus.forEach(value => {
      ret.push(value);
    });
    return ret;
  }

  ngOnDestroy(): void {
    // unsubscribe to all observables
    this.subscriptions.unsubscribe();
  }

  gotoPage(page:string): void {
    // ngZone is necessary as we are being called by a non angular component (kor-ui)
    this.ngZone.run (() => {
      this.router.navigate([page]);
    })
  }

  isActive(page:string):boolean {
    const ret = this.router.isActive(page, true);
//    console.log(page +' is active:'+ret);
    return ret;
  }

  private cleanPosition(position: string): string {
    /*    if (position.startsWith(DontCodeModel.ROOT))
          position = position.substr(DontCodeModel.ROOT.length+1);*/

    if (position.endsWith(DontCodeModel.APP_SCREENS_NAME_NODE))
    {
      position = position.substring(0, position.length-DontCodeModel.APP_SCREENS_NAME_NODE.length-1);
    }
    return position;
  }

  private updateMenu(change: Change, icon: string) {
    const key = change.position;
    const pos = this.findMenuPosOf(key);
    let menu;

    if (pos===-1)
    {
      menu= {
        routerLink: [key],
        label: change.value.name,
        icon: 'pi ' + icon
      }
    } else {
      menu = this.getDynamicMenu()[pos];
    }

    switch (change.type) {
      case ChangeType.UPDATE:
      case ChangeType.RESET:
      case ChangeType.ADD:
        if (pos!==-1) {
          this.getDynamicMenu()[pos] = menu;
        } else {
          this.getDynamicMenu().push(menu);
        }
        break;
      case ChangeType.DELETE:
        this.getDynamicMenu().splice(pos, 1);
        break;
      case ChangeType.MOVE: {
          if( pos!==-1) {
            this.getDynamicMenu().splice(pos, 1);
          }
          let beforeKeyPos = -1;
          if(change.pointer) beforeKeyPos = this.findMenuPosOf(change.pointer.containerPosition+'/'+change.beforeKey);

          if( beforeKeyPos!==-1)
            this.getDynamicMenu().splice(beforeKeyPos, 0, menu);
          else
            this.getDynamicMenu().push(menu);
          }
        break;
    }
    this.menus = this.generateMenu();
  }

  private updateMenuName(command: Change, icon: string) {
    const key = this.cleanPosition (command.position);
    const pos = this.findMenuPosOf (key);

    switch (command.type) {
      case ChangeType.UPDATE:
      case ChangeType.RESET:
      case ChangeType.ADD:
        if (pos!==-1) {
          this.getDynamicMenu()[pos].label = command.value;
        } else if (command.value) {
          this.getDynamicMenu().push({
            routerLink:[key],
            label:command.value,
            icon:'pi '+icon
          });
        }
        break;
      case ChangeType.DELETE:
        this.getDynamicMenu().splice(pos, 1);
        break;
    }
    this.menus = this.generateMenu();
  }

  private findMenuPosOf (key: string): number {
    let pos = -1;
    this.getDynamicMenu().forEach((value, index) => {
      if (value.routerLink[0] === key) {
        pos = index;
      }
    });
    return pos;
  }
}

