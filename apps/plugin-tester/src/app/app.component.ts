import { Component } from '@angular/core';
import {BaseAppComponent} from "@dontcode/sandbox";
import {dtcde} from "@dontcode/core";


@Component({
  selector: 'dontcode-tester-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseAppComponent{

}

console.log (dtcde.getModelManager());
