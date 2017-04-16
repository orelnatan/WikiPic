import      { Component, Input }          from      '@angular/core';
import      { Volume }                    from      './classes/volume.class';


@Component({

  selector: 'gallery-view',
  templateUrl: './templates/galleryViewComponent.template.html',
  styleUrls:  ['./styles/galleryViewComponent.style.css'],
 
  

})


export class GalleryViewClass {

     gallery;
     isLoaded; 
     currentImageIndex: number = 0;

     @Input() set setGallery(gallery: string[]){

         if (gallery == [""]) {
             gallery = [];
         }
         this.gallery = gallery;
         this.isLoaded = gallery.map(function(x){return false;}); 
     }
    
     singleImg: string;

     imgIndex: number  = 0;
     
     clock: any;


     loadingTime:   boolean = true;
     isDark:        boolean = false;
     isFade:        boolean = false;


    constructor(){

    }


    nextImage = () => {
        console.log('round' + this.gallery.length);
        this.currentImageIndex++;
        if (this.currentImageIndex > this.gallery.length - 1) {
            this.currentImageIndex = 0;
        }        

    }


    abortAnimation(){
        console.log(this.clock);
        clearInterval(this.clock);
        this.currentImageIndex = 0;
        
    }


    startAnimation(){
        clearInterval(this.clock);
        if ((this.gallery != undefined) && (this.gallery.length > 0)) {
            this.currentImageIndex = 0;
            this.clock = setInterval(this.nextImage, 5000);
        }

    } 

   
    imgLoaded(){

        
    }





}





