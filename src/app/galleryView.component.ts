import      { Component, Input, ViewChild }          from      '@angular/core';
import      { Volume }                    from      './classes/volume.class';


@Component({

  selector: 'gallery-view',
  templateUrl: './templates/galleryViewComponent.template.html',
  styleUrls:  ['./styles/galleryViewComponent.style.css'],
 
  

})


export class GalleryViewClass {

     @Input() set setGallery(gallery: string[]){

         if (gallery == [""]) {
             gallery = [];
         }
         this.gallery = gallery;
         this.isLoaded = gallery.map(function(x){return false;}); 
     }
  
     currentImageIndex: number = 0;
    
     gallery:   string[] = [];
     isLoaded:  boolean[] = [];
     
     clock: any;
     
     loadingTime:   boolean = false;
     isDark:        boolean = false;
     isFade:        boolean = false;
     isNone:        boolean = false;
     showImgs:      boolean = false;


    constructor(){

    }


    showMainImg(){

        this.isNone = false;
        this.showImgs = true;

    }



    galleryOpened(){
        
        setTimeout(() => {
            //console.log('run');
            this.showImgs = true;
            this.startAnimation();

        }, 1000)

    }


    nextImage = () => {
        
        this.currentImageIndex ++;
        if (this.currentImageIndex > this.gallery.length - 1) {
            this.currentImageIndex = 0;
        }        

    }


    abortAnimation(){
     
        this.showImgs = false;
        clearInterval(this.clock);
        this.currentImageIndex = 0;

        this.isNone = true;
    }


    startAnimation(){
        
        this.isNone = false;

        clearInterval(this.clock);
        if ((this.gallery != undefined) && (this.gallery.length > 0)) {
            this.currentImageIndex = 0;
            this.clock = setInterval(this.nextImage, 5000);
        }

    } 

   
    imgLoaded(){

        
    }


   


}





