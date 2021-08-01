import {AfterViewInit, Component, ComponentFactoryResolver, Injector, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {map} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {CommandProviderInterface} from "@dontcode/core";
import {DynamicBaseComponent} from "../../../shared/dynamic/components/dynamic-base.component";
import {ChangeProviderService} from "../../../shared/command/services/change-provider.service";
import {DynamicInsertDirective} from "../../../shared/dynamic/directives/dynamic-insert.directive";

@Component({
  selector: 'dontcode-sandbox-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent extends DynamicBaseComponent implements OnInit, AfterViewInit {
  screenName$:Observable<Params> = EMPTY;

  @ViewChild(DynamicInsertDirective, {static:true}) host!: DynamicInsertDirective;

  constructor(route:ActivatedRoute,
              componentFactoryResolver: ComponentFactoryResolver,
              provider:ChangeProviderService,
              injector: Injector) {
    super(route, componentFactoryResolver, injector, provider );
  }

  ngOnInit():void {
    super.ngOnInit();
    this.screenName$ = this.route.params;
  }

  ngAfterViewInit(): void {
    this.screenName$ = this.route.params;

    this.subscriptions.add(this.route.url.pipe (
      map (segments => {
        let position:string|null = null;
        segments.forEach(value => {
          if (position === null)
            position = value.path;
          else
            position = position + '/' + value.path;
        });
        console.log("Searching for component handling route ", position);

        if(!position) throw new Error ("No position in route to screen");
        const schemaPointer = this.provider.calculatePointerFor(position);
        this.subscriptions.add(this.loadComponent(schemaPointer.schemaPosition, this.host).pipe(
          map(component => {
            return { position, component };
          }),
          map(context => {
            // We shouldn't need to convert this.provider to CommandProviderInterface,
            // But otherwise we get an ts error
            context.component.initCommandFlow(this.provider as unknown as CommandProviderInterface,
              schemaPointer);
          })
        ).subscribe(() => {
          //console.log("Loaded");
        }));
      })
    ).subscribe());
  }

}
