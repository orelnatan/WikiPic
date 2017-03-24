import      { Component, Input }          from      '@angular/core';
import      { Volume }                    from      './classes/volume.class';


@Component({

  selector: 'gallery-view',
  templateUrl: './templates/galleryViewComponent.template.html',
  styleUrls:  ['./styles/galleryViewComponent.style.css'],
 
  

})


export class galleryViewClass {

     @Input() set setGallery(gallery: string[]){

         this.gallery = gallery;
         this.singleImg = this.gallery[0];

     }

     gallery:   string[] = [];
     singleImg: string;

     imgIndex: number  = 0;
     clock: any;

    constructor(){

    }


    abortAnimation(){

        clearTimeout(this.clock);

        this.imgIndex = 0;
        this.singleImg = this.gallery[this.imgIndex];
        
    }


    startAnimation(){

        this.clock = setTimeout(this.setNextImg , 1000);

    } 


    setNextImg = () => {

        if(this.imgIndex < this.gallery.length){
        
            this.singleImg = this.gallery[this.imgIndex];
            this.imgIndex ++;
        }

        else this.imgIndex = 0;    

           this.startAnimation();

    }




}