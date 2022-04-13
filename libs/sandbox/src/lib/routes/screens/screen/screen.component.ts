import {AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {map} from "rxjs/operators";
import {EMPTY, Observable, Subscription} from "rxjs";
import {ChangeProviderService} from "../../../shared/command/services/change-provider.service";
import {
  ComponentLoaderService,
  DynamicInsertPoint,
  PluginBaseComponent,
  PossibleTemplateList,
  TemplateList
} from "@dontcode/plugin-common";
import {DefaultViewerComponent} from "../../../shared/dynamic/components/default-viewer.component";
import {DontCodeModelPointer} from "@dontcode/core";

@Component({
  selector: 'dontcode-sandbox-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DynamicInsertPoint, { read: ViewContainerRef, static: false })
  dynamicInsertPoint!: ViewContainerRef;

  protected subscriptions = new Subscription();
  screenName$:Observable<Params> = EMPTY;

  constructor(protected route:ActivatedRoute,
              protected provider:ChangeProviderService,
              protected loader: ComponentLoaderService,
              protected injector: Injector) {

  }

  ngOnInit():void {
    //super.ngOnInit();
    this.screenName$ = this.route.params;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {

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

        if(position==null) throw new Error ("No position in route to screen");
        if (this.provider == null) {
          throw new Error ("No provider");
        }
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
