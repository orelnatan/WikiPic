import      { Component, Input, Output, EventEmitter, ViewChild  }          from      '@angular/core';
import      { Volume }                                                      from      './classes/volume.class';


@Component({

  selector: 'content-view',
  templateUrl: './templates/contentViewComponent.template.html',
  styleUrls:  ['./styles/contentViewComponent.style.css'],
 
  

})


export class ContentViewClass {

   @Input() set setVolumeEntry(volume: Volume){

       this.volumeEntry = volume;
    }

    @Input() rowReference:   any;
    @Input() selectedRow:    number = -1;

    @Output() closeContentBoxEvent = new EventEmitter();

    @ViewChild('galleryViewRef') childRef;

    volumeEntry:    Volume;
    lock:           boolean = false;

    notifications = {

        closeInfoBoxIcoUrl:     'https://maxcdn.icons8.com/Color/PNG/24/Arrows/collapse2-24.png'

    }

    constructor(){

    }

    print(){
       
    }


    sendCloseContentBoxEvent(){

        this.closeContentBoxEvent.emit();
    
    }

    animationAndRowSizeControl(){

        if(this.rowReference.id == this.selectedRow && !this.lock){
          
           this.rowReference.style.height = 700 + 'px';
           this.childRef.startAnimation();
           
           this.lock = true;
        }

        else if(this.rowReference.id != this.selectedRow && this.lock) {
           
           this.rowReference.style.height = 200 + 'px'; 
           this.childRef.abortAnimation();
           
           this.lock = false;
        }

    }


    getStyle(){

        let style = {
           
           'mainWrapperInvisible':               (this.rowReference.id != this.selectedRow),
           'mainWrapperVisible':                 (this.rowReference.id == this.selectedRow)  
          
       };  

       this.animationAndRowSizeControl();

       return style;
    }


}