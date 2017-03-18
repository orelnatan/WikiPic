import { BrowserModule }                from              '@angular/platform-browser';
import { NgModule }                     from              '@angular/core';
import { HttpModule, JsonpModule }      from              '@angular/http';
import { ReactiveFormsModule }          from              '@angular/forms';
import { appRootClass }                 from              './appRoot.component';


@NgModule({
  
  declarations: [ appRootClass,  ],
  
  imports: [ BrowserModule, HttpModule, JsonpModule, ReactiveFormsModule ],
  
  providers: [ ],
  
  bootstrap: [ appRootClass ]

})

export class AppModule { }
