import    { Injectable }        from        '@angular/core';
import    { Http , Response }   from        '@angular/http';
import    { Volume }            from        '../classes/volume.class';
import    { Observable }        from        'rxjs/Rx';
import                                      'rxjs/add/operator/mergeMap';


@Injectable()
export class DataServices {

    packageUrls = {

        package0_Url:   'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srwhat=text&srlimit=2000&srsearch=',
        package1_Url:   'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=',
        package2_Url:   ['https://en.wikipedia.org/w/api.php?search=', '&action=opensearch&format=json'],
        package3_Url:   'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&pageids=',
        package4_Url:   ['https://en.wikipedia.org/w/api.php?action=query&pageids=', '&generator=images&prop=imageinfo&iiprop=url&format=json']

    }


    constructor(private http: Http) {
        
        
    }


  getAllVolumesFromServer(keyWord: string): Observable <any>{
        
        let package0_Obs = this.http.get(this.packageUrls.package0_Url + keyWord).map(this.getPackage_0);      //Package_0 includes volume's Header...

        let package1_Obs = package0_Obs.flatMap(this.getPackage_1);             //Package_1 includes volume's PageId and title...
        let package2_Obs = package0_Obs.flatMap(this.getPackage_2);             //Package_2 includes volume's Description and url...
        let package3_Obs = package1_Obs.flatMap(this.getPackage_3);             //Package_3 includes volume's Contents...
        let package4_Obs = package1_Obs.flatMap(this.getPackage_4);             //Package_4 includes volume's Media...
        
        let allPackages = Observable.forkJoin(package1_Obs, package2_Obs, package3_Obs, package4_Obs); 

        return allPackages.flatMap(this.analyzeData);  
    }
    

    getPackage_0(response: Response): string[] {
       
       let data = response.json().query.search;
       let titls:   string[] = [];

       for(var i in data){

           let title = data[i].title;
           titls.push(title);
       } 
    
       return titls;
    }


     getPackage_1 = (titles: string[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];

        for(let i in titles){
                                
            let Package1 = this.http.get(this.packageUrls.package1_Url + titles[i]).map(this.extrctPackage_1).catch(this.handleError);            
            observables.push(Package1);
   
        }
        
        return Observable.forkJoin(observables);
    }

    
    getPackage_2 = (titles: string[]): Observable <any> => {

        let observables: Observable <any>[] = [];

        for(let i in titles){
                        
            let Package2 = this.http.get(this.packageUrls.package2_Url[0] + titles[i] + this.packageUrls.package2_Url[1]).map(this.extrctPackage_2).catch(this.handleError);            
            observables.push(Package2);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getPackage_3 = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});
        
        for(let i in pageIds){
                        
            let Package3 = this.http.get(this.packageUrls.package3_Url + pageIds[i]).map(this.extrctPackage_3(pageIds[i])).catch(this.handleError);            
            observables.push(Package3);
   
        }
        
        return Observable.forkJoin(observables);
    }


    getPackage_4 = (array: Object[]): Observable <any> => {
        
        let observables: Observable <any>[] = [];
        let pageIds = array.map(function(object) {return object['pageId']});

        for(let i in pageIds){

            let Package4 = this.http.get(this.packageUrls.package4_Url[0] + pageIds[i] + this.packageUrls.package4_Url[1]).map(this.extrctPackage_4).catch(this.handleError);
            observables.push(Package4);

        }

        return Observable.forkJoin(observables);
    }


    extrctPackage_1(response: Response): Object {
        
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


    extrctPackage_2(response: Response): Object {

       let data             = response.json();
       
       let description     = data[2][0];
       let url             = data[3][0];
       
       return {

           description:     description,
           url:             url

       };
    }

    
    extrctPackage_3(pageId: string){    

        return function(response: Response): Object {
            
            let data = response.json();   
            
            return {

                content:    data.query.pages[pageId].extract
                
            };  
        }
    }


     extrctPackage_4(response: Response): Object {

         let data               = []; 
         let imgArray: string[] = [];
         
         let index:         string = '-1';
         let indexToNum:    number = 0;

         try{
             data = response.json().query.pages;   
         } catch(error){ return { images:    imgArray }; }

         for(let i in data){

             try{
                let imgUrl = data[index].imageinfo[0].url;
                imgArray.push(imgUrl);
             } catch(error){ }

             indexToNum = parseInt(index);
             indexToNum --;
             index = indexToNum.toString();
         }
         
         return {

             images:    imgArray

         };  
     }
   

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


    private handleError(error: any): Promise<any> {
        
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);

    }



}