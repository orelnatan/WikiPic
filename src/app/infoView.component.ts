import      { Component, Input }          from      '@angular/core';
import      { Volume }                    from      './classes/volume.class';

declare var katex: any;

@Component({

  selector: 'info-view',
  templateUrl: './templates/infoViewComponent.template.html',
  styleUrls:  ['./styles/infoViewComponent.style.css'],
 
  

})


export class InfoViewClass {

    @Input() set setRowId(id: number){

        if(id == undefined) id = -1;

        this.rowId = id;

        if(this.rowId == -1) this.top = 160;
        else this.top = 320;

    }
     

    @Input() outSideWrapperRef:   any;
    @Input() desc:                string; 

    headers:          Object[] = [];

    top:              number;
    rowId:            number;
    
    manuIsOpen:       boolean = true;


    constructor(){


    }
 

     navigateToParagLocation(id: string){
        
        let idNumber = id.split('#')[1];       
        
        let paragId = 'title' + idNumber + '#' + this.rowId;
       
        setTimeout(() => {

            let elementPosition = (document.getElementById(paragId).getBoundingClientRect());						       
            this.outSideWrapperRef.scrollTop += elementPosition.top - this.top;
  
        }, 0);
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

        if(linkId == '-1') return;

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

        let headers     = document.getElementById('infoPanel' + '#' + this.rowId).querySelectorAll('h1, h2, h3, h4, h5, h6');
        let spans       = document.getElementById('infoPanel' + '#' + this.rowId).querySelectorAll('span');
        let annotations = document.getElementById('infoPanel' + '#' + this.rowId).querySelectorAll('annotation'); 

        for (let i in annotations) {
            
                let mathBox = document.createElement("div");
                
                mathBox.style.color = 'dodgerblue';
                mathBox.style.padding = '10px';
            
                if ((annotations[i] != undefined) && (annotations[i].innerHTML != undefined)) {

                        try {
                            katex.render(annotations[i].innerHTML, mathBox);
                            annotations[i].parentElement.replaceChild(mathBox, annotations[i]);
                        } catch (e) {

                        }
                    
                }
        }

         for(let i = 0; i < headers.length; i ++){
        
            if(headers[i].id != undefined){
                headers[i].id = 'title' + i + '#' + this.rowId;
                document.getElementById('title' + i + '#' + this.rowId).style.color = '#e50914'; 
            }

            let obj = {

                title:      headers[i].textContent,
                type:       headers[i].tagName

            }
            
            if(obj.title != undefined){
                this.headers.push(obj);
            }
        }

        
    }



}
