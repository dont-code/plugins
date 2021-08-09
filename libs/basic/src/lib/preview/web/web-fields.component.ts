import {ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";
import {dtcde} from "@dontcode/core";
import {Subscriber} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'plugins-web-fields',
  templateUrl: './web-fields.component.html',
  styleUrls: ['./web-fields.component.css']
})
export class WebFieldsComponent extends AbstractDynamicComponent implements OnDestroy{

  @ViewChild('EDIT_URL',{static:true})
  private editUrlTemplate!: TemplateRef<any>;
  @ViewChild('READ_URL',{static:true})
  private readUrlTemplate!: TemplateRef<any>;
  @ViewChild('EDIT_IMAGE',{static:true})
  private editImageTemplate!: TemplateRef<any>;
  @ViewChild('READ_IMAGE',{static:true})
  private readImageTemplate!: TemplateRef<any>;

  protected subscriber = new Subscriber ();

  constructor(protected ref:ChangeDetectorRef) {
    super();
  }

  providesTemplates(type:string): TemplateList {
    switch (type) {
      case 'Website (url)':
        return new TemplateList(this.readUrlTemplate, null,this.editUrlTemplate);
      case 'Image':
      default:
        return new TemplateList(this.readImageTemplate, null, this.editImageTemplate);
    }
  }

  canProvide(type?: string): PossibleTemplateList {
    switch (type) {
      case 'Website (url)':
      case 'Image':
        return new PossibleTemplateList(true, false, true);
      default:
        return new PossibleTemplateList(false, false, false);
    }
  }

  calculateUrl(url: string): string {
    if (!url) return url;

    if (url.includes('//')) {
      url = url.substring(url.indexOf('//')+2);
    }

    if (url.length>20)
      return url.substring(0, 17)+'...';
    else
      return url;
  }

  supportsImageUpload (): boolean{
    return dtcde.getStoreManager().canStoreDocument (this.parentPosition||undefined);
  }

  uploadImage(event: any) {
    console.log("Uploading image", event);
     this.subscriber.add(dtcde.getStoreManager().storeDocuments (event.files,this.parentPosition||undefined).pipe(map (loaded => {
      console.log("File uploaded:", loaded.documentId);
      this.form.get(this.name)?.setValue(loaded.documentId);
      this.ref.markForCheck();
      this.ref.detectChanges();
    })
     ).subscribe());
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
