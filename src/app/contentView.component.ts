import      { Component, Input, Output, EventEmitter, ViewChild, OnDestroy  }          from      '@angular/core';
import      { Volume }                                                      from      './classes/volume.class';
import      { Icons }                                                       from      './classes/icons.class';
import      { DataServices }                                                from      './services/dataServices.service';

@Component({

  selector: 'content-view',
  templateUrl: './templates/contentViewComponent.template.html',
  styleUrls:  ['./styles/contentViewComponent.style.css'],
 
  providers:  [ DataServices ],

})


export class ContentViewClass implements OnDestroy {

   @Input() set setVolumeEntry(volume: Volume){
      console.log('close1');
       this.galleryViewRef.abortAnimation();
       this.forceOpen = false;
       
       this.volumeEntry = volume;

       if(this.rowReference == -1) {
           
           this.forceOpen = true;
           this.galleryViewRef.startAnimation();
       }

       try{
            if(this.rowReference.id == this.selectedRow || this.forceOpen){
                 
                console.log('close2'); 
                this.galleryViewRef.abortAnimation(); 

                this.getSubjectContentFromService();
                this.getSubjectGalleryFromService();

                this.galleryViewRef.startAnimation();
            }
       }catch(exp){ }

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

    icon:           Icons = new Icons();

    notifications = {

        closeInfoBoxIcoUrl:     'https://maxcdn.icons8.com/Color/PNG/24/Arrows/collapse2-24.png',
        openWabIcoUrl:          'https://maxcdn.icons8.com/Color/PNG/24/Logos/internet_explorer-24.png',
        openManuIcon:            this.icon.openManuIcon

    }

    constructor(private dataServices: DataServices){

    }

    print(){
       
    }


    ngOnDestroy(){

        this.galleryViewRef.abortAnimation();
        console.log('distroy');

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

           this.galleryViewRef.startAnimation();
           
           this.lock = true;
        }

        else if(this.rowReference.id != this.selectedRow && this.lock) {
           
           console.log('close4');
           this.galleryViewRef.abortAnimation();
           
           this.isNone = true;
           this.lock = false;
        }

    }


    getStyle(){

        let style = {
           
           'containerVisible':                 (this.rowReference.id == this.selectedRow || this.forceOpen) ,
           'containerInvisible':               (this.rowReference.id != this.selectedRow && !this.forceOpen)
            
       };  

       this.rowOpened();

       return style;
    }


}



/*
    @Input() set setSubjectTitle(title){

        this.galleryViewRef.abortAnimation();

       if(title == '') return;
       
       this.dataServices.getPageId(title).subscribe((response) => {
 
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
*/