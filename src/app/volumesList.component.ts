import      { Component, Input, Output, EventEmitter }       from      '@angular/core';
import      { Volume }                                                  from      './classes/volume.class';
import    { VolumeEntryClass }             from              './volumeEntry.component';

@Component({

  selector: 'volumes-list',
  templateUrl: './templates/volumesListComponent.template.html',
  styleUrls:  ['./styles/volumesListComponent.style.css'],
 
  

})


export class VolumesListClass {

    @Input() set setVolumesList(list: Volume[]){
        
        this.startIndex += list.length;
        this.amount = this.startIndex + 10;

        list = this.remnant.concat(list);
        this.remnant = [];
        
        let customizedList = this.fitResponeToTemplate(list);

        this.divideDataToRows(customizedList);

        this.lock        = false;
        this.loadingTime = false;
               
    }
    
    @Output() dataRequestEvent = new EventEmitter();

    volumesList:    Volume[][] = []; 
    remnant:        Volume[]   = []
    volumeToShow:   Volume     = new Volume('', '', {}, [''],'', '', '', '');
    prevVolume:     Volume;

    startIndex:     number = 0;
    amount:         number = 0;
    openRowId:      number = -1;

    lock:           boolean; 
    loadingTime:    boolean = false;
    isVisible:      boolean = false;

    nextHover:      VolumeEntryClass; 
    prevHover:      VolumeEntryClass;

    constructor(){

    }


    print(ref){
        console.log(ref);
    }


     fitResponeToTemplate(list: Volume[]) {
       
        let length = list.length;

        if(length % 5 == 0) return list;

        let rest = length % 5;
        let aptSize = length - rest;

        let customizedList = list.slice(0, aptSize);
        this.remnant = list.slice(aptSize, list.length);
    
        return customizedList;
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
    
        if((this.volumesList.length > 0) && (this.culcPercent() == 0)) {this.isVisible = true;}
        else{this.isVisible = false;}
    }


    loadMor(){

         this.isVisible = false;
         this.requestMorData();
    }


    onScroll(event){
       
         if(this.culcPercent() > 97 && !this.lock){

              this.requestMorData();
         }  
    
    }


    requestMorData(){

        this.sendDataRequest();
        this.loadingTime = true;
        this.lock = true;

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
            amount:         this.amount

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


    resetList(){

         this.volumesList = [];
         this.remnant     = [];

         this.resetRange();

         this.closeContentBox();

    }


    resetRange(){

        this.loadingTime = true
        this.startIndex  = 0;
        this.amount      = 0
    }


    closeContentBox(){

        this.openRowId = -1;
        
        try{ this.prevHover.isHover = false; } catch(exp) { };

    }


    hoverEntry(ref: VolumeEntryClass){

        try{ this.prevHover.isHover = false; } catch(exp) { };

        this.nextHover = ref;
        this.nextHover.isHover = true;

        this.prevHover = this.nextHover;        

    }


}
    


/*

@Input() set setVolumesList(list: Volume[]){
        
        this.startIndex = list.length;
        this.amount = this.startIndex + 40;
       
        this.volumesList = [];
        this.divideDataToRows(list);

        if(this.newList(list[0])) this.closeContentBox();

        this.lock        = false;
        this.loadingTime = false; 
    }

processRespone(list: Volume[]): Volume[] {
        console.log('hiii');
        let length = list.length;

        if(length % 5 == 0) return list;

        let rest = length % 5;
        let aptSize = length - rest;

        let newList = list.slice(0, aptSize);

        this.startIndex += newList.length;
        this.amount = this.startIndex + 40;
        console.log(this.startIndex);
        return newList;
    }


*/