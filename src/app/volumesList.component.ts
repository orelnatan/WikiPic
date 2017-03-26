import      { Component, Input, Output, EventEmitter }          from      '@angular/core';
import      { Volume }                                          from      './classes/volume.class';


@Component({

  selector: 'volumes-list',
  templateUrl: './templates/volumesListComponent.template.html',
  styleUrls:  ['./styles/volumesListComponent.style.css'],
 
  

})


export class VolumesListClass {

    @Input() set setVolumesList(list: Volume[]){
        
        this.startIndex = list.length;
        this.amount = this.startIndex + 20;
       
        this.volumesList = [];
        this.divideDataToRows(list);

        this.closeContentBox();

        this.lock = false; 
    }
    
    @Output() dataRequestEvent = new EventEmitter();
    
    volumesList:    Volume[][] = []; 
    volumeToShow:   Volume = new Volume('', '', '', [''], '', '', '');
    prevVolume:     Volume;

    startIndex:     number = 0;
    amount:         number = 0;
    openRowId:      number = -1;

    lock:           boolean; 
 

    constructor(){

    }


    print(ref){
        console.log(ref);
    }


    newList(newVolume: Volume){

        if(this.prevVolume != newVolume) return 1;

        this.prevVolume = newVolume;
        console.log('0')
        return 0;
    }


    divideDataToRows(list: Volume[]){
        
        let numberOfRows = Math.ceil(list.length / 5);
        let rowIndex = 0;
        let cellIndex = 0;

        while(rowIndex < numberOfRows){

            let row: Volume[] = [];

            for(let i = 0; i < 5 && cellIndex < list.length; i ++){

                row.push(list[cellIndex]);
                cellIndex ++;
            }

            this.volumesList.push(row);
            rowIndex ++

        }
        
    }


    onScroll(event){
       
         if(this.culcPercent() > 90 && !this.lock){

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


    getVolumeById(event){

       let volId = event;
        
       for(let row in this.volumesList){

           for(let cell in this.volumesList[row]){

               if(this.volumesList[row][cell].volId == volId){

                   this.volumeToShow = this.volumesList[row][cell];
                   this.openRowId = parseInt(row);
                   return;
               }

           }
       } 
        
    }


    closeContentBox(){

        this.openRowId = -1;

    }


}
    


