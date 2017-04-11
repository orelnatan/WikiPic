import    { Injectable }                     from        '@angular/core';
import    { Http , Response, Jsonp }         from        '@angular/http';
import    { Volume }                         from        '../classes/volume.class';
import    { Observable }                     from        'rxjs/Rx';
import    { FormControl }                    from        '@angular/forms';
import    { Subscription }                   from        'rxjs/Subscription';
import    { AppRootClass }                   from        '../appRoot.component';
import                                                   'rxjs/add/operator/mergeMap';


@Injectable()
export class DataServices {

    wikiApis = {

        allTitles_Api:                  'https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&format=json&srwhat=text&srlimit=2000&srsearch=',
        pageIdsAndTitles_Api:           'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&titles=',
        descriptionsAndUrls_Api:        'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=',
        contents_Api:                   'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&origin=*&redirects=true&titles=',
        mainImg_Api:                    'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=800&origin=*&titles=',
        gallery_Api:                    'https://en.wikipedia.org/w/api.php?action=query&origin=*&generator=images&prop=imageinfo&iiprop=url&format=json&pageids=',
        autocomplete:                   'http://en.wikipedia.org/w/api.php?action=opensearch&callback=JSONP_CALLBACK&format=json&origin=*&search='
    };


    forbiddenFormats = ['webm', 'tif', 'ogg', 'svg'];
    
    index:          number = 0;
    startIndex:     number = 0;
    amount:         number = 0;

    lock:           boolean;

    headerResponse         = [];

    targetClass:    AppRootClass;

    constructor(private http: Http) {
           
    }


  getPrimeryVolume(keyword: string, targetClass: AppRootClass): Observable <any> {

      if(keyword == '') return;

      this.startIndex = 0;
      this.amount     = 1;
      this.lock = true;

      return this.getAllVolumesFromServer(keyword, targetClass).map((observable) => {

          return observable[0];

      });
  }


  getAllVolumesFromServer(keyword: string, targetClass: AppRootClass): Observable <any>{
        
        if(keyword == '') return; 

        this.targetClass = targetClass;
        console.log('Searching...');
          
        return this.http.get(this.wikiApis.allTitles_Api + keyword).map(this.getAllTitles(this))

        .flatMap(this.getPageIdsAndTitles)
        .flatMap(this.getDescriptions)
        .flatMap(this.getMainImg)
        .flatMap(this.analyzeData);

    }
    

   getAllTitles(classReference: DataServices){
      
        return function (response: Response): string[] {
            
           if(classReference.lock){
              classReference.headerResponse = response.json().query.search;
            }
            
           classReference.lock = false;  
           let titls:   string[] = [];
              
           let reply = classReference.rangeIsValid(classReference.headerResponse.length, classReference.startIndex, classReference.amount);
           
           if(!reply['indicator']) return;
        
            classReference.amount = reply['amount'];

            for(let i = classReference.startIndex; i < classReference.amount; i ++){                       // for(let i = classRef.startIndex; i < classRef.amount; i ++){

                let title = classReference.headerResponse[i].title;           
                titls.push(title);
            } 
            
            classReference.startIndex += titls.length;
            classReference.amount = classReference.startIndex + 45;
            
            
            if(classReference.startIndex == classReference.headerResponse.length){
                console.log('End of list!!!');
                classReference.targetClass.endOfListAlert();
            }


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


    getPageId(title: string){

        return this.http.get(this.wikiApis.pageIdsAndTitles_Api + title).map(this.extrectPageId).catch(this.handleError); 

    }


    extrectPageId(response: Response){

        let data = response.json();   
        let pageId: string;
        
         for (let key in data.query.pages) {
            
              pageId = key.toString();

         }   

         return pageId;
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


    getContent(title: string, pageId: string){
                            
         return this.http.get(this.wikiApis.contents_Api + title).map(this.extrctContent(pageId, this)).catch(this.handleError);            
         
    }


    extrctContent(pageId, classRef){    

        return function(response: Response) {
            
            try{
                return response.json().query.pages[pageId].extract;   
            }catch(exp){ return '';}

        }
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
         
         if(volumes.length == 0) {
            
           let volume = this.http.get('').map(this.createVolume('', '', {}, [], '', ' ', '', ''));
           volumes.push(volume);
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
        this.startIndex     = 1;
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







