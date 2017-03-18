import    { Injectable }        from        '@angular/core';
import    { Http , Response }   from        '@angular/http';
import    { Volume }            from        '../classes/volume.class';
import    { Observable }        from        'rxjs/Rx';
import                                      'rxjs/add/operator/mergeMap';
import      { FormControl }        from      '@angular/forms';

@Injectable()
export class DataServices {

    wikiApis = {

        allTitles_Api:                  'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srwhat=text&srlimit=2000&srsearch=',
        pageIdsAndTitles_Api:           'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=',
        descriptionsAndUrls_Api:       ['https://en.wikipedia.org/w/api.php?search=', '&action=opensearch&format=json'],
        contents_Api:                   'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&pageids=',
        media_Api:                     ['https://en.wikipedia.org/w/api.php?action=query&pageids=', '&generator=images&prop=imageinfo&iiprop=url&format=json']

    };


    constructor(private http: Http) {
        
        
    }


  getAllVolumesFromServer(keyWord: string): Observable <any>{
        console.log('Searching...');
        
        if(keyWord == '') return;
        
        return this.http.get(this.wikiApis.allTitles_Api + keyWord).map(this.getAllTitles)

        .flatMap(this.getPageIdsAndTitles)
        .flatMap(this.getDescriptionsAndUrls)
        .flatMap(this.getContents)
        .flatMap(this.getMedia);
             
    }
    

    getAllTitles(response: Response): string[] {
       
       let data = response.json().query.search;
       let titls:   string[] = [];

       for(var i in data){

           let title = data[i].title;
           titls.push(title);
       } 
    
       return titls;
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
                        
            let descriptionsAndUrls = this.http.get(this.wikiApis.descriptionsAndUrls_Api[0] + titles[i] + this.wikiApis.descriptionsAndUrls_Api[1]).map(this.extrctDescriptionsAndUrls(array, parseInt(i))).catch(this.handleError);            
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

            let media = this.http.get(this.wikiApis.media_Api[0] + pageIds[i] + this.wikiApis.media_Api[1]).map(this.extrctMedia(array, parseInt(i))).catch(this.handleError);
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


    extrctMedia(array: Object[], index: number){
        
        return function(response: Response): Object {

            let data               = []; 
            let imgArray: string[] = [];
            let keys:     string[] = [];

            let emptyImgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png';

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
                imgArray.push(emptyImgUrl);
                return finalObj;
             }

            for (let key in data) { keys.push(key.toString()); }
            
            for(let i in keys){

                let imgUrl = data[keys[i]].imageinfo[0].url;                
                
                if(imgUrl.split(".")[3] != 'svg'){ imgArray.push(imgUrl); } 

            }

            if(imgArray.length == 0){ imgArray.push(emptyImgUrl); }

            return finalObj;
        }
   
    }


    private handleError(error: any): Promise<any> {
        
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);

    }



}




/*


extrctMedia(array: Object[], index: number){
        
        return function(response: Response): Object {

            let data               = []; 
            let imgArray: string[] = [];
            
            let innerIndex:         string = '-1';
            let indexToNum:         number = 0;

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
            } catch(error){ return finalObj; }

            for(let i in data){

                try{
                    let imgUrl = data[innerIndex].imageinfo[0].url;
                    imgArray.push(imgUrl);
                } catch(error){ }

                indexToNum = parseInt(innerIndex);
                indexToNum --;
                innerIndex = indexToNum.toString();
            }
            
            return finalObj;
        }
   
    }



*/