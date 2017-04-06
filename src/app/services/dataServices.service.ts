import    { Injectable }                     from        '@angular/core';
import    { Http , Response, Jsonp }         from        '@angular/http';
import    { Volume }                         from        '../classes/volume.class';
import    { Observable }                     from        'rxjs/Rx';
import    { FormControl }                    from        '@angular/forms';
import    { Subscription }                   from        'rxjs/Subscription';
import                                                   'rxjs/add/operator/mergeMap';


@Injectable()
export class DataServices {

    wikiApis = {

        allTitles_Api:                  'https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&format=json&srwhat=text&srlimit=2000&srsearch=',
        pageIdsAndTitles_Api:           'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&titles=',
        descriptionsAndUrls_Api:        'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=',
        contents_Api:                   'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&explaintext=&pageids=',
        mainImg_Api:                    'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=800&origin=*&titles=',
        gallery_Api:                    'https://en.wikipedia.org/w/api.php?action=query&origin=*&generator=images&prop=imageinfo&iiprop=url&format=json&pageids='

    };


    forbiddenFormats = ['webm', 'tif', 'ogg', 'svg'];
    
    index:          number = 0;
    startIndex:     number = 0;
    amount:         number = 25;

    lock:           boolean;

    headerResponse         = [];

    constructor(private http: Http) {
           
    }


  getAllVolumesFromServer(keyword: string): Observable <any>{
        
        if(keyword == '') return; 

        console.log('Searching...');
          
        return this.http.get(this.wikiApis.allTitles_Api + keyword).map(this.getAllTitles(this))

        .flatMap(this.getPageIdsAndTitles)
        .flatMap(this.getDescriptions)
        .flatMap(this.getMainImg)
        .flatMap(this.analyzeData);

    }
    
   getAllTitles(classRef) {

        return function (response: Response): string[] {
            
           if(classRef.lock){
              classRef.headerResponse = response.json().query.search;
            }

           classRef.lock = false;  
           let titls:   string[] = [];
              
           let reply = classRef.rangeIsValid(classRef.headerResponse.length, classRef.startIndex, classRef.amount);

           if(!reply['indicator']) return;
        
            classRef.amount = reply['amount'];

            for(let i = classRef.startIndex; i < classRef.amount; i ++){                         // for(let i in data){ 

                let title = classRef.headerResponse[i].title;           
                titls.push(title);
            } 
            
            classRef.startIndex += titls.length;
            classRef.amount = classRef.startIndex + 45;

            return titls;
        }

   }

     getPageIdsAndTitles = (titles: string[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];

        for(let i in titles){
                                
            let pageIdsAndUrls = this.http.get(this.wikiApis.pageIdsAndTitles_Api + titles[i]).map(this.extrctPageIdsAndTitles).catch(this.handleError);            
            observables.push(pageIdsAndUrls);
   
        }
        
        return Observable.forkJoin(observables);
    }

    
    getDescriptions = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let titles = array.map(function(object) {return object['title']});
        
        for(let i in titles){
                        
            let descriptionsAndUrls = this.http.get(this.wikiApis.descriptionsAndUrls_Api + titles[i]).map(this.extrctDescriptions(array, parseInt(i))).catch(this.handleError);            
            observables.push(descriptionsAndUrls);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getMainImg = (array: Object[]): Observable <any> => {

        let observables: Observable <any>[] = [];
        let titles = array.map(function(object) {return object['title']});

        for(let i in titles){
                        
           let mainImg = this.http.get(this.wikiApis.mainImg_Api + titles[i]).map(this.extrctMainImg(array, parseInt(i))).catch(this.handleError);            
           observables.push(mainImg);
   
        }
        
        return Observable.forkJoin(observables);
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


    extrctPageIdsAndTitles(response: Response): Object {
        
        let data = response.json();   
        let pageId: string;
        
         for (let key in data.query.pages) {
            
              pageId = key.toString();

         }   
        
         let title = data.query.pages[pageId].title;

         return {

            title:    title,
            pageId:   pageId

        };
    }


    extrctDescriptions(array: Object[], index: number){
        
        return function(response: Response): Object {

            let data             = response.json();
            
            let description     = data[2][0];
            
            return {

                pageId:          array[index]['pageId'],
                title:           array[index]['title'],
                description:     description         
            };
        }

    }
    

    extrctMainImg(array: Object[], index: number){

         return function(response: Response) {

             let data = response.json().query.pages;
             let mainImg = '';
             
             try{
                mainImg = data[array[index]['pageId']].thumbnail['source'];           
             }catch(exp){mainImg = '';}

             return {

                pageId:          array[index]['pageId'],
                title:           array[index]['title'],
                description:     array[index]['description'],
                mainImg:         mainImg        
            };

         }

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


    getGallery(pageId: number){

        return this.http.get(this.wikiApis.gallery_Api + pageId).map(this.extrctGallery(pageId, this)).catch(this.handleError);

    }


    extrctGallery(pageId: number, classRef){

        return function(response: Response) {

            let data               = []; 
            let imgArray: string[] = [];
            let keys:     string[] = [];

            try{
                data = response.json().query.pages;   
            } catch(error){ 
                imgArray.push('');
                return imgArray;
            }

            for(let key in data) { keys.push(key.toString()); }

            for(let i in keys){

                try{
                    let imgUrl = data[keys[i]].imageinfo[0].url;                
                    
                    if(!classRef.formatIsValid(imgUrl)) { imgArray.push(imgUrl); } 
                } catch(error){}
            }

             if(imgArray.length == 0){ imgArray.push(''); }

            return imgArray;
        }

    }


    getContent(pageId: number){
                            
         return this.http.get(this.wikiApis.contents_Api + pageId).map(this.extrctContent(pageId,this)).catch(this.handleError);            
         
    }


    extrctContent(pageId: number, classRef){    

        return function(response: Response) {
            
            let data        = response.json();   
            let content     = data.query.pages[pageId].extract
            
            return classRef.analyzeContent(content);
        }
    }


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



    analyzeData = (array: Array <any>): Observable <any> => {
        
         let volumes:       Observable <any>[] = [];

         let titles             = array.map(function(object) {return object['title']}); 
         let pageIds            = array.map(function(object) {return object['pageId']});        
         let descriptions       = array.map(function(object) {return object['description']});
         let mainImgs           = array.map(function(object) {return object['mainImg']});
         
         for(let i in titles){

             let volume = this.http.get('').map(this.createVolume(titles[i], descriptions[i], {}, [], mainImgs[i], ' ', 'vol' + this.index, pageIds[i]));
             
              if(mainImgs[i] != ''){
                
                  this.index ++;
                  volumes.push(volume);
              }

         }
         
         return Observable.forkJoin(volumes);
     }


     createVolume(title: string, description: string, content: {}, images: string[], mainImg: string, url: string, id: string, pageId: string) {

          return function(): Volume {
            
            images.push(mainImg);
            return new Volume(title, description, content, images, mainImg, url, id, pageId); 

        }

     }


     resetList(){

        this.index          = 0;
        this.startIndex     = 0;
        this.amount         = 25;
            
        this.lock           = true;

     }


     formatIsValid(imgUrl: string): boolean{

         for(let i in this.forbiddenFormats){

             if(imgUrl.split(".")[3] == this.forbiddenFormats[i]) return true; 
         }

         return false;
     }


     rangeIsValid(maxLength, startIndex, amount): Object{

          let indicator: boolean = true;

          if(startIndex > maxLength){
              
              console.log('Error: start index out of range.');
              indicator = false;
          }

          if(amount > maxLength){
              
              console.log('Note: range fixed.');
              amount = maxLength;
              indicator = true;
          }

          return {

              indicator:    indicator,
              startIndex:   startIndex,
              amount:       amount

          };
     }




    private handleError(error: any): Promise<any> {
        
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);

    }



}







