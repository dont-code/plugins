import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {CommonConfigService} from "@dontcode/plugin-common";

@Injectable({
  providedIn: 'root'
})
export class DevTemplateManagerService {

  protected templates:DevTemplate[]=[];

  constructor(protected http:HttpClient, protected configService:CommonConfigService) { }

  getTemplates () : Observable<DevTemplate[]> {
    if (this.templates.length>0)
      return of(this.templates);
    else {
      let templateUrl = this.configService.getConfig()?.templateFileUrl;
      if (!templateUrl)
        templateUrl = 'assets/dev/default-templates.json';
      return this.http.get(templateUrl, { responseType: "json" }).pipe(
        map(value => {
          this.templates = new Array<DevTemplate>();
          const src = value as Array<any>;
          for (const tmpl of src){
            this.templates.push(new DevTemplate(tmpl));
          };
          return this.templates;
        }),
        catchError(err => {
          console.log("Error reading Dev templates file", err);
          throw err;
        })
      )
    }
  }

  filterTemplates (templateName:string): Observable<DevTemplate[]> {
    //console.log ("filter templates called", templateName);
    templateName=templateName.toLowerCase();
    return this.getTemplates().pipe(
     map(value => {
       const ret = value.filter(tmpl => {
         if (tmpl.name.toLowerCase().startsWith(templateName)) {
           return true;
         } else return false;
       });
       // console.log("filter templates returning",ret);
       return ret;
      }));
  }

}

export class DevTemplate {
  constructor(tmpl: any) {
    this.name=tmpl.name;
    this.sequence = [];
    // Support loading simple templates
    if (tmpl.position !== undefined) {
      this.sequence.push(new DevStep(
        tmpl.position,
        tmpl.type,
        tmpl.value
      ));
    } else {
      for (const seq of tmpl.sequence) {
        this.sequence.push(new DevStep(seq.position, seq.type, seq.value));
      }

    }
  }

  name:string;
  sequence: Array<DevStep>;

  isSequence():boolean {
    if( this.sequence)
      return (this.sequence.length>1);
    else
      return false;
  }
}

export class DevStep {
  /**
   * Value can be a string or a json value
   */

  constructor(public position:string, public type:string, public value:string|any|null ) {
  }

  isValid() {
    return ((this.position!=null)&&(this.type!=null));
  }
}

