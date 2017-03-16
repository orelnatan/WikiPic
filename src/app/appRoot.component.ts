import      { Component }          from      '@angular/core';
import      { DataServices }       from      './services/dataServices.service';
import      { Observable }         from      'rxjs/Rx';
import      { Volume }             from      './classes/volume.class';
import                                       './operators/rxjs-operators';


@Component({

  selector: 'app-root',
  templateUrl: './templates/appRootComponent.template.html',
  styleUrls: ['./styles/appRootComponent.style.css'],
  providers: [ DataServices ],

})


export class appRootClass {
  
    notifications = {

    };

    entrys: string[] = [];

    constructor(private dataServices: DataServices){

    }


    getUserInput(value: string){
        
        if(value == '') return;

        this.dataServices.getAllVolumesFromServer(value).subscribe((response) => {
            
           console.log(response);
        });
        
       

        

    }


    


}
