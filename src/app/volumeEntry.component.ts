
import      { Component, Input, ViewChild }          from      '@angular/core';
import      { Volume }                               from      './classes/volume.class';


@Component({

  selector: 'volume-entry',
  templateUrl: './templates/volumeEntryComponent.template.html',
  styleUrls:  ['./styles/volumeEntryComponent.style.css'],
 
  

})


export class VolumeEntryClass {

     @Input() set setVolumeEntry(volume: Volume){

         this.volumeEntry = volume;

     }

     @ViewChild('galleryViewRef') childRef;

     volumeEntry: Volume;

    constructor(){

    }


    print(){

        

    }





}