import {ChangeDetectorRef, Component, OnDestroy, Optional, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";
import {DontCodeStoreManager, dtcde} from "@dontcode/core";
import {map} from "rxjs/operators";
import {ConfirmationService} from "primeng/api";
import {FileUpload} from "primeng/fileupload";

@Component({
  selector: 'plugins-web-fields',
  templateUrl: './web-fields.component.html',
  styleUrls: ['./web-fields.component.css'],
  providers: [ConfirmationService]
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

  @ViewChild(FileUpload)
  private fileUpload!:FileUpload;

  constructor(protected confirm:ConfirmationService, @Optional() protected storeMgr: DontCodeStoreManager, protected ref:ChangeDetectorRef) {
    super();
      // Hack for when DI doesn't find the storemanager due to mfe stuff
    if (this.storeMgr==null) {
      this.storeMgr = dtcde.getStoreManager();
      console.warn("DontCodeStoreManager not found by Angular's Injector");
    }
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
    return this.storeMgr.canStoreDocument (this.parentPosition||undefined);
  }

  uploadImage(event: any) {
  /*  this.confirm.confirm({
      header:'Confirm',
      message: 'Uploading:'+JSON.stringify(event, null, 4),
      accept: ()=>{*/
        console.info("Uploading image", event);
        this.form.get(this.name)?.setValue(undefined);
        this.value=null;
        this.subscriptions.add(this.storeMgr.storeDocuments (event.files,this.parentPosition||undefined).pipe(map (loaded => {
            console.debug("File uploaded:", loaded.documentId);
            this.form.get(this.name)?.setValue(loaded.documentId);
            this.value=loaded.documentId;
            return loaded;
          })
        ).subscribe({
          /*next: (value) => {
            this.confirm.confirm({
              header: 'Uploaded',
              message: 'Uploaded:'+JSON.stringify(value, null, 4)
            });
          },*/
          error: (error)=> {
            this.fileUpload.clear();
            this.ref.markForCheck();
            this.ref.detectChanges();
            this.confirm.confirm({
              header: 'Error',
              message: 'Error:'+JSON.stringify(error, null, 4)
            });
          },
          complete: () => {
            this.fileUpload.clear();
            this.ref.markForCheck();
            this.ref.detectChanges();
          }
        }));

 //     }
 //   });
  }

}
