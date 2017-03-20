import      { Component, Input, Output, EventEmitter }          from      '@angular/core';
import      { Volume }                                          from      './classes/volume.class';


@Component({

  selector: 'volumes-list',
  templateUrl: './templates/volumesListComponent.template.html',
  styleUrls:  ['./styles/volumesListComponent.style.css'],
 
  

})


export class VolumesListClass {

    @Input() set setVolumesList(list: Volume[]){

        this.volumesList = list;
        
        this.startIndex = this.volumesList.length;
        this.amount = this.startIndex + 40;

        this.lock = false; 
    }
    
    @Output() dataRequestEvent = new EventEmitter();
    
    volumesList: Volume[] = []; 
    
    startIndex: number;
    amount: number;

    lock: boolean; 

    constructor(){

    }

    onScroll(event){
       
         if(this.culcPercent() > 75 && !this.lock){

              this.sendDataRequest();
              this.lock = true;

         }  
    }


    culcPercent(){

        let h = document.documentElement, 
            b = document.body,
           st = 'scrollTop',
           sh = 'scrollHeight';

        return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;

    }

   
    sendDataRequest(){

        let eventData = {

            startIndex:     this.startIndex,
            amount:         this.amount,
            join:           true

        };


        this.dataRequestEvent.emit(eventData);

    }


}
    


