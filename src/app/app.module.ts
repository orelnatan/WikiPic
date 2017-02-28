import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { appRootClass } from './appRoot.component';


@NgModule({
  
  declarations: [ appRootClass,  ],
  
  imports: [ BrowserModule, ],
  
  providers: [ ],
  
  bootstrap: [ appRootClass ]

})

export class AppModule { }
