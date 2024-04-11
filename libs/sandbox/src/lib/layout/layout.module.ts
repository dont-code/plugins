import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MainComponent} from "./main/main.component";
import {MenuComponent} from "./menu/menu.component";
import {SidebarModule} from "primeng/sidebar";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {TooltipModule} from "primeng/tooltip";
import {OverlayPanelModule} from "primeng/overlaypanel";

@NgModule({
  declarations: [MainComponent, MenuComponent],
  exports: [MainComponent],
  imports: [
    CommonModule, RouterModule, SidebarModule, ToolbarModule, ButtonModule, MenuModule, TooltipModule, OverlayPanelModule
  ]
})
export class LayoutModule { }

export * from "./main/main.component";
export * from "./app/BaseAppComponent";
export * from "./app/LightAppComponent";
