import {AfterViewInit, Component, Injector, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {map} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {ChangeProviderService} from "../../../shared/command/services/change-provider.service";
import {ComponentLoaderService, PluginBaseComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";
import {DefaultViewerComponent} from "../../../shared/dynamic/components/default-viewer.component";
import {DontCodeModelPointer} from "@dontcode/core";

@Component({
  selector: 'dontcode-sandbox-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent extends PluginBaseComponent implements OnInit, AfterViewInit {
  screenName$:Observable<Params> = EMPTY;

  constructor(protected route:ActivatedRoute,
              public provider:ChangeProviderService,
              loader: ComponentLoaderService,
              injector: Injector) {
    super( loader, injector );
  }

  ngOnInit():void {
    //super.ngOnInit();
    this.screenName$ = this.route.params;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.subscriptions.add(this.route.url.pipe (
      map (segments => {
        let position:string|null = null;
        segments.forEach(value => {
          if (position === null)
            position = value.path;
          else
            position = position + '/' + value.path;
        });
        console.log("Searching for component handling route", position);

        if(!position) throw new Error ("No position in route to screen");
        let component = null;
        try {
        const pointer = this.provider.calculatePointerFor(position);

        this.loader.loadComponentFactory(pointer, this.provider.getJsonAt(position)).then (factory => {
          this.dynamicInsertPoint.clear();
          if( factory) {
            component = this.loader.createComponent(factory, this.dynamicInsertPoint, pointer);
          } else {
              // Display the default viewer component if no factory are found...
            component = this.loader.createGivenComponent(DefaultViewerComponent, this.dynamicInsertPoint, pointer);
          }
        });
        } catch (error) {
          console.warn('Error creating component for '+position+':',error);
          component = this.loader.createGivenComponent(DefaultViewerComponent, this.dynamicInsertPoint,
            new DontCodeModelPointer(position, position));
        }
      })
    ).subscribe());
  }

  providesTemplates(key?: string): TemplateList {
    throw new Error("Method not implemented.");
  }
  canProvide(key?: string): PossibleTemplateList {
    throw new Error("Method not implemented.");
  }
}
