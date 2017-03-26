
import      { Component, Input, Output, EventEmitter, ViewChild }          from      '@angular/core';
import      { Volume }                                                     from      './classes/volume.class';


@Component({

  selector: 'volume-entry',
  templateUrl: './templates/volumeEntryComponent.template.html',
  styleUrls:  ['./styles/volumeEntryComponent.style.css'],
 
  

})


export class VolumeEntryClass {

     @Input() set setVolumeEntry(volume: Volume){

         this.volumeEntry = volume;

     }

     @Output() contentBoxRequestEvent = new EventEmitter();

     @ViewChild('galleryViewRef') childRef;

     volumeEntry:   Volume;
     mouseEnter:    boolean = false;

     notifications = {

        openInfoBoxIcoUrl:       'https://maxcdn.icons8.com/Color/PNG/48/Arrows/expand2-48.png'

    };


    constructor(){

    }


    print(){  }


    onMouseEnter(){

        this.childRef.startAnimation()
        this.mouseEnter = true;

    }


    onMouseLeave(){

        this.childRef.abortAnimation();
        this.mouseEnter = false;

    }


    sendContentBoxRequestEvent(){
        
        this.contentBoxRequestEvent.emit(this.volumeEntry.volId);

    }


    getIntroductionDivStyle(){

      let style = {

          'introductionDivInvisible':        (!this.mouseEnter),
          'introductionDivVisible':          (this.mouseEnter)
       
      };  

      return style;
  }


   getGalleryCompStyle(){

       let style = {

           'galleryComponent':                     (true),
           'galleryComponentOnHover':              (this.mouseEnter)

       };  

       return style;

   }

}