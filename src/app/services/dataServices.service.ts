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
        media_Api:                      'https://en.wikipedia.org/w/api.php?action=query&origin=*&generator=images&prop=imageinfo&iiprop=url&format=json&pageids='

    };


    forbiddenFormats = ['webm', 'tif', 'ogg', 'svg'];
    
    keyword:        string = '';
    prevKey:        string = '';

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
        
        if(this.listIsNew(keyword)){

            this.index          = 0;
            this.startIndex     = 0;
            this.amount         = 25;
            
            this.lock           = true;
        }
       
        return this.http.get(this.wikiApis.allTitles_Api + keyword).map(this.getAllTitles(this))

        .flatMap(this.getPageIdsAndTitles)
        .flatMap(this.getDescriptionsAndUrls)
        //.flatMap(this.getContents)
        .flatMap(this.getMedia)
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

    
    getDescriptionsAndUrls = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let titles = array.map(function(object) {return object['title']});
        
        for(let i in titles){
                        
            let descriptionsAndUrls = this.http.get(this.wikiApis.descriptionsAndUrls_Api + titles[i]).map(this.extrctDescriptionsAndUrls(array, parseInt(i))).catch(this.handleError);            
            observables.push(descriptionsAndUrls);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getContents = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});
        
        for(let i in pageIds){
                        
            let contents = this.http.get(this.wikiApis.contents_Api + pageIds[i]).map(this.extrctContents(array, parseInt(i))).catch(this.handleError);            
            observables.push(contents);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getMedia = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});

        for(let i in pageIds){

            let media = this.http.get(this.wikiApis.media_Api + pageIds[i]).map(this.extrctMedia(array, parseInt(i), this)).catch(this.handleError);
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
            //let url             = data[3][0];
            
            return {

                pageId:          array[index]['pageId'],
                title:           array[index]['title'],
                description:     description
                //url:             url
                
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
                    
                    if(!classRef.formatIsValid(imgUrl)) { imgArray.push(imgUrl); } 
                } catch(error){}

            }

            if(imgArray.length == 0){ imgArray.push(''); }

            return finalObj;
        }
   
    }


    analyzeData = (array: Array <any>): Observable <any> => {
         
         let volumes:       Observable <any>[] = [];

         let titles             = array.map(function(object) {return object['title']}); 
         let pageIds            = array.map(function(object) {return object['pageId']});
         
         let descriptions       = array.map(function(object) {return object['description']});
         let urls               = array.map(function(object) {return object['url']});
         
         let contents           = array.map(function(object) {return object['content']});
         
         let images             = array.map(function(object) {return object['images']});
         
         for(let i in titles){

             let volume = this.http.get('').map(this.createVolume(titles[i], descriptions[i], ' ', images[i], ' ', 'vol' + this.index, pageIds[i]));
             
              if(images[i][0] != ''){
                
                  this.index ++;
                  volumes.push(volume);
              }
         }
         
         return Observable.forkJoin(volumes);
     }


     createVolume(title: string, description: string, content: string, images: string[], url: string, id: string, pageId: string) {

          return function(): Volume {
            
            return new Volume(title, description, content, images, url, id, pageId); 

        }

     }


     listIsNew(keyword: string): boolean {
       
        this.keyword = keyword;
        
        if(this.keyword == this.prevKey){ 
            return false;
        }

        this.prevKey = this.keyword;
        return true;
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







