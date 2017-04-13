import      { Component, Input }          from      '@angular/core';
import      { Volume }                    from      './classes/volume.class';


@Component({

  selector: 'gallery-view',
  templateUrl: './templates/galleryViewComponent.template.html',
  styleUrls:  ['./styles/galleryViewComponent.style.css'],
 
  

})


export class GalleryViewClass {

     @Input() set setGallery(gallery: string[]){

         this.gallery = gallery;
         this.singleImg = this.gallery[0];
     }
    
     gallery:   string[] = [];
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


    abortAnimation(){

        clearTimeout(this.clock);

        this.imgIndex = 0;
        this.singleImg = this.gallery[this.imgIndex];
        
    }


    startAnimation(){

        this.isFade = false;
        this.clock = setTimeout(this.setNextImg , 2000);

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

        this.loadingTime = false;
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