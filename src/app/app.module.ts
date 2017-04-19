import    { BrowserModule }                from              '@angular/platform-browser';
import    { NgModule }                     from              '@angular/core';
import    { HttpModule, JsonpModule }      from              '@angular/http';
import    { ReactiveFormsModule }          from              '@angular/forms';

import    { AppRootClass }                 from              './appRoot.component';
import    { VolumesListClass }             from              './volumesList.component';
import    { VolumeEntryClass }             from              './volumeEntry.component'; 
import    { GalleryViewClass }             from              './galleryView.component'; 
import    { ContentViewClass }             from              './contentView.component';
import    { InfoViewClass }                from              './infoView.component';

@NgModule({
  
  declarations: [ AppRootClass, VolumesListClass, VolumeEntryClass, GalleryViewClass, ContentViewClass, InfoViewClass,  ],
  
  imports: [ BrowserModule, HttpModule, JsonpModule, ReactiveFormsModule, ],
  
  providers: [ ],
  
  bootstrap: [ AppRootClass ]

})

export class AppModule { }
