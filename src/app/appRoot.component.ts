import      { Component }          from      '@angular/core';
import      { DataServices }       from      './services/dataServices.service';
import      { Observable }         from      'rxjs/Rx';
import      { Volume }             from      './classes/volume.class';
import      { FormControl }        from      '@angular/forms';

@Component({

  selector: 'app-root',
  templateUrl: './templates/appRootComponent.template.html',
  styleUrls:  ['./styles/appRootComponent.style.css'],
  providers:  [ DataServices ],

})


export class AppRootClass {
  
    notifications = {

        searchIcoUrl:       'https://maxcdn.icons8.com/ultraviolet/PNG/20/Very_Basic/search-20.png'

    };

    volumes: Volume[] = [];
    keyword = new FormControl();
    
    constructor(private dataServices: DataServices){
  
        this.keyword.valueChanges.debounceTime(600)
        .subscribe((keyword) => {
            
            if(keyword == '') return;

            this.getDataFromService(keyword, 0, 40, false);

        });
         
    }


    getDataFromService(keyword, startIndex: number, amount: number, join: boolean){
        
        this.dataServices.getAllVolumesFromServer(keyword, startIndex, amount)
        .subscribe((response) => {

           if(!join) this.volumes = [];

           this.volumes = this.volumes.concat(response);
           console.log(this.volumes);
        });

    }


    processDataRequest(event){
        
        this.getDataFromService(this.keyword.value, event.startIndex, event.amount, event.join);

    }

    


}



