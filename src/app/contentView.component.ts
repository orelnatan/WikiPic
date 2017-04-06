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

    @Input() rowReference:   any;
    @Input() selectedRow:    number = -1;

    @Output() closeContentBoxEvent = new EventEmitter();

    @ViewChild('galleryViewRef') childRef;

    volumeEntry:    Volume;
    isNone:         boolean = false;
    lock:           boolean = false;

    titles:         string[] = [];
    paragraphs:     string[] = [];


    notifications = {

        closeInfoBoxIcoUrl:     'https://maxcdn.icons8.com/Color/PNG/24/Arrows/collapse2-24.png',
        openWabIcoUrl:          'https://maxcdn.icons8.com/Color/PNG/24/Logos/internet_explorer-24.png'

    }

    constructor(private dataServices: DataServices){

    }

    print(){
       
    }


    getSubjectContentFromService(){
        
         this.dataServices.getContent(parseInt(this.volumeEntry.pageId))
        .subscribe((response) => {

            this.volumeEntry.content = response;

            this.titles = this.volumeEntry.content['titles'];
            this.paragraphs = this.volumeEntry.content['contents'];

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

        if(this.rowReference.id == this.selectedRow && !this.lock){
           
           this.getSubjectContentFromService();
           this.getSubjectGalleryFromService();

           this.rowReference.style.height = 700 + 'px';
           this.childRef.startAnimation();
           
           this.lock = true;
        }

        else if(this.rowReference.id != this.selectedRow && this.lock) {
           
           this.rowReference.style.height = 200 + 'px'; 
           this.childRef.abortAnimation();
           
           this.isNone = true;
           this.lock = false;
        }

    }


    navigateToParagLocation(id: string, wrapperRef){
        
        let idNumber = id.split('#')[1];
        let paragId = 'title#' + idNumber + '#' + this.rowReference.id;
        
        let elementPosition = (document.getElementById(paragId).getBoundingClientRect());						
        wrapperRef.scrollTop += elementPosition.top - 400;

                console.log(elementPosition);
    }


    getStyle(){

        let style = {
           
           'mainWrapperInvisible':               (this.rowReference.id != this.selectedRow)
            
       };  

       this.rowOpened();

       return style;
    }


}