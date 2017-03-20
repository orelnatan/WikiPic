import    { BrowserModule }                from              '@angular/platform-browser';
import    { NgModule }                     from              '@angular/core';
import    { HttpModule, JsonpModule }      from              '@angular/http';
import    { ReactiveFormsModule }          from              '@angular/forms';

import    { AppRootClass }                 from              './appRoot.component';
import    { VolumesListClass }             from              './volumesList.component';


@NgModule({
  
  declarations: [ AppRootClass, VolumesListClass  ],
  
  imports: [ BrowserModule, HttpModule, JsonpModule, ReactiveFormsModule ],
  
  providers: [ ],
  
  bootstrap: [ AppRootClass ]

})

export class AppModule { }
