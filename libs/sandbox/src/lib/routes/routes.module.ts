import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListCommandsComponent } from "./debug/list-commands/list-commands.component";
import { HomeComponent } from "./home/home.component";
import { InsertCommandComponent } from "./debug/insert-command/insert-command.component";
import { DebugPageComponent } from "./debug/debug-page/debug-page.component";
import { ScreenComponent } from "./screens/screen/screen.component";
import { SharedModule } from "../shared/shared.module";
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import {PluginCommonModule} from "@dontcode/plugin-common";


@NgModule({
  declarations: [ListCommandsComponent, HomeComponent, InsertCommandComponent, DebugPageComponent, ScreenComponent],
    imports: [
        CommonModule,
        SharedModule,
        AccordionModule,
        AutoCompleteModule,
        PanelModule,
        InputTextModule,
        ReactiveFormsModule,
        InputTextareaModule,
        ButtonModule,
        DropdownModule,
        PluginCommonModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoutesModule { }
