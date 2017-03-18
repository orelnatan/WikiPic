import      { Component }          from      '@angular/core';
import      { DataServices }       from      './services/dataServices.service';
import      { Observable }         from      'rxjs/Rx';
import      { Volume }             from      './classes/volume.class';
import      { FormControl }        from      '@angular/forms';

@Component({

  selector: 'app-root',
  templateUrl: './templates/appRootComponent.template.html',
  styleUrls: ['./styles/appRootComponent.style.css'],
  providers: [ DataServices ],

})


export class appRootClass {
  
    notifications = {

        searchIcoUrl:       'https://maxcdn.icons8.com/ultraviolet/PNG/20/Very_Basic/search-20.png'

    };

    volumes: Volume[] = [];
    keyWord = new FormControl();
    
    constructor(private dataServices: DataServices){
  
        this.keyWord.valueChanges.debounceTime(600)
        .subscribe((keyWord) => {
            
            if(keyWord == '') return;

            this.getDataFromService(keyWord);

        });
         
    }


    getDataFromService(keyWord){
        
        this.dataServices.getAllVolumesFromServer(keyWord).subscribe((response) => {

           this.volumes = []; 
           this.analyzeData(response);
           console.log(this.volumes);

        });

    }


    analyzeData(data: Array <Object>) {

        for(let i in data){

            let volume: Volume = new Volume(data[i]['title'], 
                                            data[i]['description'], 
                                            data[i]['content'], 
                                            data[i]['images'],
                                            data[i]['url'],
                                            'vol' + i, 
                                            data[i]['pageId']);

            this.volumes.push(volume);                                

        }

    }

    


}



