import      { Component, Input, Output, EventEmitter }       from      '@angular/core';
import      { Volume }                                               from      './classes/volume.class';
import      { Icons }                                                from      './classes/icons.class';
import      { VolumeEntryClass }                                     from      './volumeEntry.component';
import      { Location, LocationStrategy, PathLocationStrategy }     from      '@angular/common';

declare var $:any;

@Component({

  selector: 'volumes-list',
  templateUrl: './templates/volumesListComponent.template.html',
  styleUrls:  ['./styles/volumesListComponent.style.css'],
 
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],

})


export class VolumesListClass {

    @Input() columns: number; 

    @Input() set setVolumesList(list: Volume[]){
      
        this.startIndex += list.length;
        this.amount = this.startIndex + 12;

        list = this.remnant.concat(list);
        this.remnant = [];
        
        let customizedList = this.fitResponeToTemplate(list);
       
        if(customizedList.length == 0 && this.remnant.length > 0 && !this.endOfList){ 
            this.loadMor(); 
        }

        this.divideDataToRows(customizedList);

        this.lockDataFlow        = false;
        this.loadingTime         = false;
               
    }
    
    @Output() dataRequestEvent = new EventEmitter();

    volumesList:    Volume[][] = []; 
    remnant:        Volume[]   = []
    volumeToShow:   Volume     = new Volume('', '', {}, [''],'', '', '', '');
    prevVolume:     Volume;

    startIndex:     number = 0;
    amount:         number = 0;
    openRowId:      number = -1;

    lockUrl:        boolean = false;
    lockDataFlow:   boolean = false; 
    loadingTime:    boolean = false;
    isVisible:      boolean = false;
    endOfList:      boolean = false;

    nextHover:      VolumeEntryClass; 
    prevHover:      VolumeEntryClass;
    
    icon:               Icons = new Icons();
    
    notifications = {

        searchMorIcon:       this.icon.searchMorIcon


    };
    


    constructor(private location: Location){
    }


    print(){ }


     fitResponeToTemplate(list: Volume[]) {
        
        let length = list.length;

        if(length % this.columns == 0) return list;

        let customizedList: Volume[] = [];

        let rest = length % this.columns;
        let aptSize = length - rest;

        customizedList = list.slice(0, aptSize);
        this.remnant = list.slice(aptSize, list.length);

        if(this.endOfList)  { customizedList = customizedList.concat(this.remnant); }

        return customizedList;
    }


    divideDataToRows(list: Volume[]){
        
        let numberOfRows = Math.ceil(list.length / this.columns);
        let rowIndex = 0;
        let cellIndex = 0;
        
        while(rowIndex < numberOfRows){

            let row: Volume[] = [];

            for(let i = 0; i < this.columns && cellIndex < list.length; i ++){

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
       
         if(this.culcPercent() > 97 && !this.lockDataFlow){

              this.requestMorData();
         }  
    
    }


    requestMorData(){

        if(this.endOfList) return;
        
        this.sendDataRequest();
        this.loadingTime = true;
        this.lockDataFlow = true;

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

         this.endOfList = false;
         this.lockUrl = false;
         
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


    navigateToRowLocation(rowRef){

        var elementPosition = (document.getElementById(rowRef.id).getBoundingClientRect());						
	    window.scrollBy(0, elementPosition.top - 120);
        //$('html, body').animate({
        //    scrollTop: $("#"+rowRef.id).offset().top
        //}, 2000);        

    }




}
    


