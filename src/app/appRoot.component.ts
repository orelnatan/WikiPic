import      { Component, ViewChild }        from        '@angular/core';
import      { DataServices }                from        './services/dataServices.service';
import      { Observable }                  from        'rxjs/Rx';
import      { Volume }                      from        './classes/volume.class';
import      { FormControl }                 from        '@angular/forms';
import      { Http , Response, Jsonp }      from        '@angular/http';
import      { Subscription }                from        'rxjs/Subscription';

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

    @ViewChild('listRef') childRef;

    allVolumes: Volume[] = [];
    volumes:    Volume[] = [];
    
    volumeCounter:      number = 0;
    keyword                    = new FormControl();
   
    loadingTime:       boolean = false;

    httpRequest:       Subscription;
 
    constructor(private dataServices: DataServices){
  
        this.keyword.valueChanges.debounceTime(600)
        .subscribe((keyword) => {
            
            if(keyword == '') return;

            this.childRef.resetList();   

            this.loadingTime = true;
            this.getDataFromService(keyword);      
        
        });
         
    }


    getDataFromService(keyword: string){

        this.httpRequest = this.dataServices.getAllVolumesFromServer(keyword)
        .subscribe((response) => {
         
              this.allVolumes = [];
              this.allVolumes = response;

              this.volumeCounter = 0;

              this.loadingTime = false;
              
              console.log(this.allVolumes);
              this.sendDataToList(0, 10);
              
        });

    }


    sendDataToList(startIndex: number, amount: number){

        this.volumes = [];

        let response = this.rangeIsValid(this.allVolumes.length, startIndex, amount);

        if(!response['indicator']) return;
        
        amount = response['amount'];

        for(let i = startIndex; i < amount; i ++){
         
            this.volumes.push(this.allVolumes[i]);
            this.volumeCounter ++;
        }

       console.log(this.volumes);
    }


    processDataRequest(event){       
        
        if(this.volumeCounter == this.allVolumes.length){

            console.log('Note: End Of Data!!');
            this.childRef.resetRange();
            this.getDataFromService(this.keyword.value);
            return;
        }

        
        this.sendDataToList(event.startIndex, event.amount);
    }

    
    abortHttpRequest(){ try{this.httpRequest.unsubscribe();} catch(exp) { } }


    rangeIsValid(maxLength, startIndex, amount): Object{

          let indicator: boolean = true;

          if(startIndex > maxLength){
              
              console.log('Error: start index out of range.');
              indicator = false;
          }

          if(amount > maxLength){
              
              console.log('Note: range fixed.');
              amount = maxLength;
              indicator = true;
          }

          return {

              indicator:    indicator,
              startIndex:   startIndex,
              amount:       amount

          };
     }


}



/*



 


*/