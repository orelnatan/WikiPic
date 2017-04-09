 
 
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


 analyzeContent(content: string){

        let length = content.length;
        
        let titles:         string[] = ['General'];
        let contents:       string[] = [];
        
        let backIndex  = 0;
        let frontIndex = 0;

        while(frontIndex < length){

            if(content[frontIndex] != '='){

                frontIndex ++;
            }

            else if(content[frontIndex] == '='){

                let text = content.slice(backIndex, frontIndex);
                contents.push(text);

                while(content[frontIndex] == '=' && frontIndex < length){
                    frontIndex ++;
                }


                let title = '';
                while(content[frontIndex] != '=' && frontIndex < length){
                    
                    title += content[frontIndex];
                    frontIndex ++;
                }
                titles.push(title);


                while(content[frontIndex] == '=' && frontIndex < length){
                    frontIndex ++;
                }

                backIndex = frontIndex;
            }

        }

      
        let newArrays = this.dropEmptyTitles(titles, contents);

        titles   = newArrays['titles'];
        contents = newArrays['contents'];
        
        let info = {

            titles:     titles,
            contents:   contents

        };

        console.log(info);
        return info; 
    }


    dropEmptyTitles(titles: string[], contents: string[]):Object {

        let newContents: string[] = [];
        let newTitles:   string[] = [];

        for(let i in contents){

            if(contents[i].length != 3){

                newContents.push(contents[i]);
                newTitles.push(titles[i]);
            }
        }
        
       let newArrays = {

           titles:      newTitles,
           contents:    newContents
       };


       return newArrays;
    }
	
	
	
	 getMedia = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});

        for(let i in pageIds){

            let media = this.http.get(this.wikiApis.gallery_Api + pageIds[i]).map(this.extrctMedia(array, parseInt(i), this)).catch(this.handleError);
            observables.push(media);

        }

        return Observable.forkJoin(observables);
		
		
		
    }

	
	
	
	extrctMedia(array: Object[], index: number, classRef: any){
        
        return function(response: Response): Object {

            let data               = []; 
            let imgArray: string[] = [];
            let keys:     string[] = [];
            
            //http://www.freeiconspng.com/uploads/no-image-icon-13.png
            //let emptyImgUrl = 'https://cduperth.s3.amazonaws.com/product_images/no-image.png';

            let finalObj = {

                description:     array[index]['description'],
                url:             array[index]['url'],
                pageId:          array[index]['pageId'],
                title:           array[index]['title'],
                content:         array[index]['content'],
                images:          imgArray

            };

            try{
                data = response.json().query.pages;   
            } catch(error){ 
                imgArray.push('');
                return finalObj;
             }

            for (let key in data) { keys.push(key.toString()); }
            
            for(let i in keys){

                try{
                    let imgUrl = data[keys[i]].imageinfo[0].url;                
                    
                    if(!classRef.formatIsValid(imgUrl)) { imgArray.push(imgUrl); } 
                } catch(error){}

            }

            if(imgArray.length == 0){ imgArray.push(''); }

            return finalObj;
        }
   
    }
	
	
	
	






















