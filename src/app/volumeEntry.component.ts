import      { ContentViewClass }                                           from      './contentView.component';
import      { Component, Input, Output, EventEmitter, ViewChild }          from      '@angular/core';
import      { Volume }                                                     from      './classes/volume.class';
import      { Icons }                                                      from      './classes/icons.class';

@Component({

  selector: 'volume-entry',
  templateUrl: './templates/volumeEntryComponent.template.html',
  styleUrls:  ['./styles/volumeEntryComponent.style.css'],
 
  

})


export class VolumeEntryClass {

     @Input() set setVolumeEntry(volume: Volume){

         this.volumeEntry = volume;

         this.childRef.showMainImg();
     };

     
     @Input() rowReference:   any;
     @Input() selectedRow:    number = -1;

     @Output() openContentBoxEvent = new EventEmitter();
     @Output() hoverRequestEvent      = new EventEmitter();

     @ViewChild('galleryViewRef') childRef;

     volumeEntry:           Volume;
     
     mouseEnter:            boolean = false;
     isHover:               boolean = false;
     contentDivOnHover:     boolean = false;

     title:                 string;

     icon:                   Icons = new Icons();

     notifications = {

        openInfoBoxIcon:       this.icon.openInfoBoxIcon

    };


    constructor(){


    }


    print(){   }


    rowIsLock(): boolean {

        if(this.rowReference.id != this.selectedRow) return false;
        
        return true;
    }


    onMouseEnter(){
        
        this.mouseEnter = true;

        this.childRef.isDark = true;
    }


    onMouseLeave(){

        this.mouseEnter = false;
        this.childRef.isDark = false;

    }


    sendOpenContentBoxEvent(){
        
        if(!this.childRef.loadingTime)
            this.hoverRequestEvent.emit(this);

        if(!this.childRef.loadingTime)
            this.openContentBoxEvent.emit(this.volumeEntry.volId);
            
    }


    getMainWrapperStyle(){

        let style = {
 
           'mainWrapperOnHover':              (this.mouseEnter  &&  !this.rowIsLock() && !this.childRef.loadingTime),
           'mainWrapperDark':                 (this.rowIsLock()),
           'mainWrapperFramed':               (this.isHover && !this.childRef.loadingTime)
    
       };  

       return style;
    }


    getIntroductionDivStyle(){

       let style = {
 
           'introductionDivInvisible':        (this.childRef.loadingTime || !this.mouseEnter || this.rowIsLock()),
           'introductionDivVisible':          (this.mouseEnter  && !this.rowIsLock())
    
       };  

       return style;
   }




}




/*

this.contentDiv = this.rowReference.
                        children.contentViewDiv.
                        children.contentViewComp.
                        children.mainWrapper.
                        children.contentWrapper.
                        children.headerDiv;


                         this.contentDiv = this.rowReference.children.contentViewDiv;
                
         this.renderer.listen(this.contentDiv, 'mouseenter', (event) => {
                
                this.isHover = true; 
         });

         this.renderer.listen(this.contentDiv, 'mouseleave', (event) => {
                
               
         });



*/