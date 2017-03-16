import { BrowserModule }                from '@angular/platform-browser';
import { NgModule }                     from '@angular/core';
import { HttpModule, JsonpModule }      from     '@angular/http';

import { appRootClass }                 from './appRoot.component';


@NgModule({
  
  declarations: [ appRootClass,  ],
  
  imports: [ BrowserModule, HttpModule, JsonpModule ],
  
  providers: [ ],
  
  bootstrap: [ appRootClass ]

})

export class AppModule { }
