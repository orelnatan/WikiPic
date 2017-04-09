import      { Component, Input }          from      '@angular/core';
import      { Volume }                    from      './classes/volume.class';


@Component({

  selector: 'info-view',
  templateUrl: './templates/infoViewComponent.template.html',
  styleUrls:  ['./styles/infoViewComponent.style.css'],
 
  

})


export class InfoViewClass {

    @Input() set setRowId(id: number){

        this.rowId = id;
        
    }
     
    @Input() outSideWrapperRef:   any;

    headers:          Object[] = [];

    rowId:            number;
    
    manuIsOpen:       boolean = true;


    constructor(){


    }
 

     navigateToParagLocation(id: string){
              
        let idNumber = id.split('#')[1];       
        let paragId = 'title' + idNumber + '#' + this.rowId;
       
        setTimeout(() => {

            let elementPosition = (document.getElementById(paragId).getBoundingClientRect());						       
            this.outSideWrapperRef.scrollTop += elementPosition.top - 400;
  
        }, 10);
    }


    getStyle(type: string){
       
        let style = {

        };

        switch(type){

            case 'H2':

            style['H2'] = true;
           
                break;
            
            case 'H3':

            style['H3'] = true;
           
                break;

            case 'H4':

            style['H4'] = true;
           
                break;

            case 'H5':

            style['H5'] = true;
           
                break;        
        }

        return style;

    }


    linkClicked(linkId){

        this.closeManuBar();
        this.navigateToParagLocation(linkId);

    }


    openManuBar(){

        this.manuIsOpen = true;
        this.outSideWrapperRef.scrollTop = 0;

    }


    closeManuBar(){

        this.manuIsOpen = false;
        this.outSideWrapperRef.scrollTop = 0;

    }


    resetLinks(){

        this.headers = [];
        this.outSideWrapperRef.scrollTop = 0;

    }


    setInfo(info: string){
        
        this.manuIsOpen = true;
        document.getElementById('infoPanel' + '#' + this.rowId).innerHTML = info;

        let headers = document.getElementById('infoPanel' + '#' + this.rowId).querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        for(let i in headers){
        
            if(headers[i].id != undefined)
                 headers[i].id = 'title' + i + '#' + this.rowId;

            let obj = {

                title:      headers[i].textContent,
                type:       headers[i].tagName

            }
            
            if(obj.title != undefined)
                this.headers.push(obj);
        }

        
    }



}
