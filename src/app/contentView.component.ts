import      { Component, Input, Output, EventEmitter, ViewChild  }          from      '@angular/core';
import      { Volume }                                                      from      './classes/volume.class';
import      { DataServices }                                                from        './services/dataServices.service';

@Component({

  selector: 'content-view',
  templateUrl: './templates/contentViewComponent.template.html',
  styleUrls:  ['./styles/contentViewComponent.style.css'],
 
  providers:  [ DataServices ],

})


export class ContentViewClass {

   @Input() set setVolumeEntry(volume: Volume){

       this.volumeEntry = volume;

       try{
            if(this.rowReference.id == this.selectedRow){
                this.getSubjectContentFromService();
                this.getSubjectGalleryFromService();
            }
       }catch(exp){ }

    }


    @Input() set setSubjectTitle(title){

        this.galleryViewRef.abortAnimation();

       if(title == '') return;
       
       this.dataServices.getPageId(title)
       .subscribe((response) => {
 
            this.volumeEntry.title = title;
            this.volumeEntry.pageId = response;
            this.volumeEntry.images = [];

            this.getSubjectContentFromService();
            this.getSubjectGalleryFromService();

            this.galleryViewRef.startAnimation();
            
            this.forceOpen = true;
            
            if(response == -1) this.forceOpen = false;
           
            console.log(response);
        });
    }

    @Input() selectedRow:            number = -1;
    @Input() rowReference:           any;

    @Output() closeContentBoxEvent = new EventEmitter();

    @ViewChild('galleryViewRef') galleryViewRef;
    @ViewChild('infoViewRef')    infoViewRef;

    volumeEntry:    Volume;
    
    isNone:         boolean = false;
    lock:           boolean = false;
    forceOpen:      boolean = false;

    notifications = {

        closeInfoBoxIcoUrl:     'https://maxcdn.icons8.com/Color/PNG/24/Arrows/collapse2-24.png',
        openWabIcoUrl:          'https://maxcdn.icons8.com/Color/PNG/24/Logos/internet_explorer-24.png',
        openManuIcoUrl:         'https://maxcdn.icons8.com/nolan/PNG/64/Very_Basic/menu-64.png'

    }

    constructor(private dataServices: DataServices){

    }

    print(){
       
    }


    manuButtonClicked(){

        if(this.infoViewRef.manuIsOpen){
            this.infoViewRef.closeManuBar();
            return;
        }

        this.infoViewRef.openManuBar();
        return;
    }


    getSubjectContentFromService(){
        
         this.dataServices.getContent(this.volumeEntry.title, this.volumeEntry.pageId)
        .subscribe((response) => {
        
            if(response == ''){ this.forceOpen = false; }

           this.infoViewRef.resetLinks();
           this.infoViewRef.setInfo(response);

        });

    }


    getSubjectGalleryFromService(){

        this.dataServices.getGallery(parseInt(this.volumeEntry.pageId))
        .subscribe((response) => {

            this.volumeEntry.images = this.volumeEntry['images'].concat(response);

        });

    }


    sendCloseContentBoxEvent(){

        this.closeContentBoxEvent.emit();
    
    }


    openSubjectOnWikiOrg(){

         window.open(this.volumeEntry.url);

    }


    rowOpened(){

        if(this.rowReference.id == this.selectedRow  && !this.lock){
           
           this.getSubjectContentFromService();
           this.getSubjectGalleryFromService();

           this.rowReference.style.height = 700 + 'px';
           this.galleryViewRef.startAnimation();
           
           this.lock = true;
        }

        else if(this.rowReference.id != this.selectedRow && this.lock) {
           
           this.rowReference.style.height = 200 + 'px'; 
           this.galleryViewRef.abortAnimation();
           
           this.isNone = true;
           this.lock = false;
        }

    }


    getStyle(){

        let style = {
           
           'mainWrapperInvisible':               (this.rowReference.id != this.selectedRow && !this.forceOpen)
            
       };  

       this.rowOpened();

       return style;
    }


}