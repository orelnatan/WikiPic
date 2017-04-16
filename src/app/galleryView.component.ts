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
     isfirst:       boolean = false;

     nextImg = document.createElement("IMG");
     prevImg = document.createElement("IMG");

    constructor(){

    }

    nextImage = () => {

        this.currentImageIndex++;
        if (this.currentImageIndex > this.gallery.length - 1) {
            this.currentImageIndex = 0;
        }        

    }

    abortAnimation(){

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

    setNextImg = () => {

        if(this.imgIndex < this.gallery.length){
        
            if(this.imgIndex != 0){
                this.isFade = true;
            }
            
            this.singleImg = this.gallery[this.imgIndex]; 
            this.imgIndex ++;
        }

        else this.imgIndex = 0;    

        clearTimeout(this.clock);
        
        setTimeout(() => {

            this.startAnimation();

        },3000);
        
        
    }

    



    imgLoaded(){

        
    }


    getStyle(){

        let style = {
           
           'galleryMonitor':            (!this.isFade),
           'galleryMonitorFadeIn':      (this.isFade)           
            
       };  


       return style;
    }



}


/*  old 

abortAnimation(){

        clearTimeout(this.clock);

        this.imgIndex = 0;
        this.singleImg = this.gallery[this.imgIndex];
        
    }


    startAnimation(){

        this.clock = setTimeout(this.setNextImg , 2000);

    } 


    setNextImg = () => {

        if(this.imgIndex < this.gallery.length){
        
            this.singleImg = this.gallery[this.imgIndex];
            this.imgIndex ++;
        }

        else this.imgIndex = 0;    

        clearTimeout(this.clock);
        this.startAnimation();
    }


///////////////////////////////////////////////////////////////////////////////////////

      abortAnimation = () => {

        clearTimeout(this.clock);

        this.imgIndex = 0;
        this.singleImg = this.gallery[this.imgIndex];
        
    }


    startAnimation = () => {

        this.isFade = false;

        this.prevImg.setAttribute("src", this.gallery[this.imgIndex]);
        //this.nextImg.setAttribute("src", this.gallery[this.imgIndex + 1]);

        this.prevImg.onload = (() => {

            this.setNextImg();
            
        });
      
    } 


    setNextImg = () => {
        
        this.isFade = true;
        this.singleImg = this.prevImg.innerHTML;

        this.imgIndex ++;

        //this.prevImg.setAttribute("src", this.gallery[this.imgIndex]);

       // this.prevImg.onload = (() => {

           

         clearTimeout(this.clock);
         console.log('hi');
         this.isFade = false;
        this.imgIndex ++;
            
        this.startAnimation();

    
            
     //   });
                           
    }


*/