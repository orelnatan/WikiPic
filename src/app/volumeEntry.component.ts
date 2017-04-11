import      { ContentViewClass }                                           from      './contentView.component';
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

     notifications = {

        openInfoBoxIcoUrl:       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABqElEQVRoQ+2YQU7DMBBFZ6iEygqk7CgLuBHcgN6AG3AFbgA3gBsBErCLxDJCKkY2BCVtEtvj+WpVTXZVMn/m/e/aaZn25OI94SAD2bUkLRFLBOSALS2QsWJZS0RsHajQEgEZK5btJfI2r66Z6NYxnRysaHn6VT+JlQGFH4fV5feM7r30+nw9kPd59UzM5+0MzrnlWVM/AGbKlgwmMweIcDn3smjqi/ZjP5Gj6pOJj7tddgFmA+IX5HXR1P+m90B8dG7Gj+t2bRNmEIKIeOWuukt/Y9caK9wGTM4sg9tvjkD2Yk8syJ1h9BzJFUqcL+kxSe/JA1EimDTpxEPSntGTXSosASrpFQXxA5U0SAUq7ZEEgoYphfDzJYOgYDQgskG0YbQgRCBaMJoQYpBSGG2IIhApDAKiGCQXBgWhApIKg4RQA4nBhEbdH0V/p6TmG3XWORI7pcdcH6rThFBNpB02BUYbAgIytcz8PQQEDGQMBgUBBWlhiOkuLDtHN8h/ZFS/7LHNAHnfQJDuSrQtEYlryBpLBOmuRNsSkbiGrLFEkO5KtC0RiWvImh8/FU5CWEPYOAAAAABJRU5ErkJggg=='

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