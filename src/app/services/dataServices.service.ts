import    { Injectable }        from        '@angular/core';
import    { Http , Response, Jsonp }   from        '@angular/http';
import    { Volume }            from        '../classes/volume.class';
import    { Observable }        from        'rxjs/Rx';
import    { FormControl }       from        '@angular/forms';

import                                      'rxjs/add/operator/mergeMap';


@Injectable()
export class DataServices {

    wikiApis = {

        allTitles_Api:                  'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srwhat=text&srlimit=2000&srsearch=',
        pageIdsAndTitles_Api:           'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=',
        descriptionsAndUrls_Api:        'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=',
        contents_Api:                   'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&pageids=',
        media_Api:                      'https://en.wikipedia.org/w/api.php?action=query&generator=images&prop=imageinfo&iiprop=url&format=json&pageids='

    };

    storge:     string = '';
    keyword:    string = '';
    prevKey:    string = '';

    constructor(private http: Http, private jsonp: Jsonp) {
        
        
    }


  getAllVolumesFromServer(keyword: string, startIndex: number, amount: number): Observable <any>{
        
        console.log('Searching...');
        
        if(!this.keysCompiler(keyword)) return;

        return this.jsonp.get(this.wikiApis.allTitles_Api + keyword).map(this.getAllTitles(startIndex, amount, this))

        .flatMap(this.getPageIdsAndTitles)
        .flatMap(this.getDescriptionsAndUrls)
        .flatMap(this.getContents)
        .flatMap(this.getMedia)
        .flatMap(this.analyzeData);
             
    }
    
   getAllTitles(startIndex: number, amount: number, classRef: any) {

        return function (response: Response): string[] {
        
           let data = response.json().query.search;
           let titls:   string[] = [];
           
           let compResponse = classRef.rangeCompiler(data.length, startIndex, amount);
           
           if(compResponse.indicator == 0) return;

           startIndex = compResponse.startIndex;
           amount     = compResponse.amount;

            for(let i = startIndex; i < amount; i ++){

                let title = data[i].title;           
                titls.push(title);
            } 
            
            return titls;
        }

   }

     getPageIdsAndTitles = (titles: string[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];

        for(let i in titles){
                                
            let pageIdsAndUrls = this.jsonp.get(this.wikiApis.pageIdsAndTitles_Api + titles[i]).map(this.extrctPageIdsAndTitles).catch(this.handleError);            
            observables.push(pageIdsAndUrls);
   
        }
        
        return Observable.forkJoin(observables);
    }

    
    getDescriptionsAndUrls = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let titles = array.map(function(object) {return object['title']});
        
        for(let i in titles){
                        
            let descriptionsAndUrls = this.jsonp.get(this.wikiApis.descriptionsAndUrls_Api + titles[i]).map(this.extrctDescriptionsAndUrls(array, parseInt(i))).catch(this.handleError);            
            observables.push(descriptionsAndUrls);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getContents = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});
        
        for(let i in pageIds){
                        
            let contents = this.jsonp.get(this.wikiApis.contents_Api + pageIds[i]).map(this.extrctContents(array, parseInt(i))).catch(this.handleError);            
            observables.push(contents);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getMedia = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});

        for(let i in pageIds){

            let media = this.jsonp.get(this.wikiApis.media_Api + pageIds[i]).map(this.extrctMedia(array, parseInt(i), this)).catch(this.handleError);
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


    extrctDescriptionsAndUrls(array: Object[], index: number){
        
        return function(response: Response): Object {

            let data             = response.json();
            
            let description     = data[2][0];
            let url             = data[3][0];
            
            return {

                pageId:          array[index]['pageId'],
                title:           array[index]['title'],
                description:     description,
                url:             url
                
            };
        }

    }
    

    extrctContents(array: Object[], index: number){    

        return function(response: Response): Object {
            
            let data = response.json();   
            
            return {

                description:     array[index]['description'],
                url:             array[index]['url'],
                pageId:          array[index]['pageId'],
                title:           array[index]['title'],
                content:         data.query.pages[array[index]['pageId']].extract
                
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
                    
                    if(!classRef.formatCompiler(imgUrl)) { imgArray.push(imgUrl); } 
                } catch(error){}

            }

            if(imgArray.length == 0){ imgArray.push(''); }

            return finalObj;
        }
   
    }


    analyzeData = (array: Array <any>): Observable <any> => {
         
         let volumes: Observable <any>[] = [];
         
         let titles             = array.map(function(object) {return object['title']}); 
         let pageIds            = array.map(function(object) {return object['pageId']});
         
         let descriptions       = array.map(function(object) {return object['description']});
         let urls               = array.map(function(object) {return object['url']});
         
         let contents           = array.map(function(object) {return object['content']});
         
         let images             = array.map(function(object) {return object['images']});
         
         for(let i in titles){

             let volume = this.jsonp.get('').map(this.createVolume(titles[i], descriptions[i], contents[i], images[i], urls[i], 'vol' + i, pageIds[i]));
             
              if(images[i][0] != '' && !this.storge.includes(titles[i])){
                
                  volumes.push(volume);
                  this.storge += titles[i];
              }

         }

         return Observable.forkJoin(volumes);
     }


     createVolume(title: string, description: string, content: string, images: string[], url: string, id: string, pageId: string) {

          return function(): Volume {
            
            return new Volume(title, description, content, images, url, id, pageId); 

        }

     }


      rangeCompiler(maxLength, startIndex, amount): Object{

          let indicator: number = 1;

          if(startIndex > maxLength){
              
              console.log('Error: start index out of range.');
              indicator = 0;
          }

          if(amount > maxLength){
              
              console.log('Note: range fixed.');
              amount = maxLength;
              indicator = 1;
          }

          return {

              indicator:    indicator,
              startIndex:   startIndex,
              amount:       amount

          };
     }


     keysCompiler(keyword: string): number {

        if(keyword == '') return 0;        
        this.keyword = keyword;
        
        if(this.keyword != this.prevKey) this.storge = '';
        this.prevKey = this.keyword;

        return 1;
     }


     formatCompiler(imgUrl: string): boolean{

         let forbiddenFormats = ['webm', 'tif', 'ogg', 'svg'];

         for(let i in forbiddenFormats){

             if(imgUrl.split(".")[3] == forbiddenFormats[i]) return true; 
         }

         return false;
     }


    private handleError(error: any): Promise<any> {
        
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);

    }



}




/*

if(imgUrl.split(".")[3] != 'svg'  && 
                       imgUrl.split(".")[3] != 'webm' && 
                       imgUrl.split(".")[3] != 'tif'  &&
                       imgUrl.split(".")[3] != 'ogg')  { imgArray.push(imgUrl); } 

*/