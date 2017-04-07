 
 
 analyzeData = (array: Array <any>): Observable <any> => {
    
         let volumes: Observable <any>[] = [];
         
         let titles             = array[0].map(function(object) {return object['title']}); 
         let pageIds            = array[0].map(function(object) {return object['pageId']});
         
         let descriptions       = array[1].map(function(object) {return object['description']});
         let urls               = array[1].map(function(object) {return object['url']});
         
         let contents           = array[2].map(function(object) {return object['content']});
         
         let images             = array[3].map(function(object) {return object['images']});

         for(let i in titles){

             let volume = this.http.get('').map(this.createVolume(titles[i], descriptions[i], contents[i], images[i], urls[i], 'vol' + i, pageIds[i]));
             volumes.push(volume);

         }

         return Observable.forkJoin(volumes);
     }


     createVolume(title: string, description: string, content: string, images: string[], url: string, id: string, pageId: string) {

          return function(): Volume {
            
            return new Volume(title, description, content, images, url, id, pageId); 

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



/////////////////////////////////////////////////////////////////////////////////////////////////////////////


   <div class = 'textWrapper'  id = "{{ 'textWrapper' + '#' + rowReference.id }}"  #wrapperRef  >

                <div id = 'linksWrapper' > 
                   
                    <div id = 'linksHeaderDiv' > Links:   </div>

                    <div  id = "{{ 'link' + '#' + i }}"    class = 'linkDiv'   (click) = 'navigateToParagLocation(linkRef.id, wrapperRef)'    #linkRef     *ngFor = 'let i = index; let title of titles' >

                        <div> {{ title }} </div>
                   
                    </div>

                </div>


                <div id = 'paragDiv'  *ngFor = 'let i = index; let title of titles' > 

                    <div  id = "{{ 'title' + '#' + i + '#' + rowReference.id }}"    class = 'titleDiv'   > {{title}} </div>
                    <div id = 'textDiv' >  {{ paragraphs[i] }} </div>

                </div>

   </div>






/////////////////////////////////////////////////////////////////////////////////////////////////////////////

