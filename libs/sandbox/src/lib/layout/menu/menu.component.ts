import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Change, ChangeType, DontCodeModel, DontCodeModelPointer,} from '@dontcode/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {ChangeProviderService} from '../../shared/command/services/change-provider.service';
import {MenuUpdater, SANDBOX_MENUS} from "@dontcode/plugin-common";

@Component({
  selector: 'dontcode-sandbox-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit, OnDestroy {
  menus: Array<MenuItem>;
  templateMenus = new Array<MenuItem>(
    {
      label: 'Main Menu',
      items: [
        { label: 'Home', icon: 'pi pi-home', routerLink: ['/'] },
        { label: 'Dev', icon: 'pi pi-book', routerLink: ['dev'] },
      ],
    },
    { label: 'Application Menu', items: new Array<any>() }
  );
  subscriptions = new Subscription();
  runtime = false;

  constructor(
    protected provider: ChangeProviderService,
    @Optional()
    @Inject(SANDBOX_MENUS)
    menuUpdater:MenuUpdater,
    private ref: ChangeDetectorRef,
    public router: Router,
    public ngZone: NgZone
  ) {
    const config = (window as any).dontCodeConfig;
    if (config?.runtime === true || config?.projectId != null)
      this.runtime = true;
    if ((menuUpdater!=null) && (this.templateMenus[0].items!=null)) {
      this.templateMenus[0].items.push(...menuUpdater.additionalMenus());
    }
    this.menus = this.generateMenu();
  }

  ngOnInit(): void {
    this.handleItemMenu(
      DontCodeModel.APP_ENTITIES,
      DontCodeModel.APP_ENTITIES_NAME_NODE,
      'pi-ticket'
    );
    this.handleItemMenu(
      DontCodeModel.APP_SCREENS,
      DontCodeModel.APP_SCREENS_NAME_NODE,
      'pi-desktop'
    );
    this.handleItemMenu(
      DontCodeModel.APP_REPORTS,
      DontCodeModel.APP_REPORTS_TITLE_NODE,
      'pi-chart-pie'
    );
  }

  handleItemMenu(itemPosition: string, nameKey: string, icon: string) {
    this.subscriptions.add(
      this.provider
        .receiveCommands(itemPosition, nameKey)
        .pipe(
          map((command) => {
            if (command.type==ChangeType.ACTION) return;
            // eslint-disable-next-line no-restricted-syntax
            // console.debug("Received menu change for ", command.position);
            this.updateMenuName(command, icon);
            this.ref.detectChanges();
          })
        )
        .subscribe()
    );
    this.subscriptions.add(
      this.provider
        .receiveCommands(itemPosition + '/?')
        .pipe(
          map((command) => {
            if (command.type==ChangeType.ACTION) return;

            // eslint-disable-next-line no-restricted-syntax
            // console.debug("Received menu change for ", command.position);
            if (command.position.length > itemPosition.length + 1) {
              // Avoid adding empty entities (received due to reset)
              this.updateMenu(command, nameKey, icon);
              this.ref.detectChanges();
            } else if (!command.value) {
              // Reset all menus
              this.getDynamicMenu().length = 0;
              this.ref.detectChanges();
            }
          })
        )
        .subscribe()
    );
  }

  getDynamicMenu(): Array<MenuItem> {
    if (this.templateMenus[1].items) return this.templateMenus[1].items;
    else return [];
  }

  generateMenu(): Array<any> {
    // Create a new menu object to update UI
    const ret = new Array<any>();
    if (!this.runtime) {
      this.templateMenus.forEach((value) => {
        ret.push(value);
      });
    } else {
      this.getDynamicMenu().forEach((value) => {
        ret.push(value);
      });
      if (ret.length === 0) {
        ret.push(this.templateMenus[1]);
      }
    }
    return ret;
  }

  ngOnDestroy(): void {
    // unsubscribe to all observables
    this.subscriptions.unsubscribe();
  }

  gotoPage(page: string): void {
    // ngZone is necessary as we are being called by a non angular component (kor-ui)
    this.ngZone.run(() => {
      this.router.navigate([page]);
    });
  }

  isActive(page: string): boolean {
    const ret = this.router.isActive(page, true);
    //    console.log(page +' is active:'+ret);
    return ret;
  }

  private cleanPosition(position: string): string {
    /*    if (position.startsWith(DontCodeModel.ROOT))
          position = position.substr(DontCodeModel.ROOT.length+1);*/

    if (position.endsWith(DontCodeModel.APP_SCREENS_NAME_NODE)) {
      position = position.substring(
        0,
        position.length - DontCodeModel.APP_SCREENS_NAME_NODE.length - 1
      );
    }
    return position;
  }

  private updateMenu(change: Change, nameKey:string, icon: string) {

    // Actions are not changing anything in menus
    if (change.type==ChangeType.ACTION) {
      return;
    }

    const key = change.position;
    const pos = this.findMenuPosOf(key);
    let menu;

    if (pos === -1) {
      if (change.value?.[nameKey]!=null) {
        menu = {
          routerLink: [key],
          label: change.value[nameKey],
          icon: 'pi ' + icon,
        };
      } else return;
    } else {
      menu = this.getDynamicMenu()[pos];
    }

    switch (change.type) {
      case ChangeType.UPDATE:
      case ChangeType.RESET:
      case ChangeType.ADD:
      case ChangeType.DELETE:
        // These are handled at the name change level
        break;
      case ChangeType.MOVE:
        {
          if (pos !== -1) {
            this.getDynamicMenu().splice(pos, 1);
          }
          let beforeKeyPos = -1;
          if (change.pointer)
            beforeKeyPos = this.findMenuPosOf(
              change.pointer.containerPosition + '/' + change.beforeKey
            );

          if (beforeKeyPos !== -1)
            this.getDynamicMenu().splice(beforeKeyPos, 0, menu);
          else this.getDynamicMenu().push(menu);
        }
        this.menus = this.generateMenu();
        break;
    }
  }

  private updateMenuName(command: Change, icon: string) {

    // Actions are not changing anything in menus
    if (command.type==ChangeType.ACTION) {
      return;
    }

    const parentPos =DontCodeModelPointer.parentPosition(command.position);
    if (parentPos==null) {
      console.error("Cannot update menu name for "+command.position+" with no parent position");
      return;
    }


    const key = this.cleanPosition(
      parentPos
    );
    const pos = this.findMenuPosOf(key);
    const name = command.value;

    let menu;
    if (pos === -1) {
      menu = {
        routerLink: [key],
        label: command.value,
        icon: 'pi ' + icon,
      };
    } else {
      menu = this.getDynamicMenu()[pos];
    }

    switch (command.type) {
      case ChangeType.UPDATE:
      case ChangeType.RESET:
      case ChangeType.ADD:
        if (pos !== -1) {
          menu.label = name;
        } else {
          this.getDynamicMenu().push(menu);
        }
        break;
      case ChangeType.DELETE:
        if (pos !== -1) this.getDynamicMenu().splice(pos, 1);
        break;
      case ChangeType.MOVE:
        {
          // The move is handled at the menu level
        }
        break;
    }
    this.menus = this.generateMenu();
  }

  private findMenuPosOf(key: string): number {
    let pos = -1;
    this.getDynamicMenu().forEach((value, index) => {
      if (value.routerLink[0] === key) {
        pos = index;
      }
    });
    return pos;
  }
}
