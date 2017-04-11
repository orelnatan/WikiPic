import      { Component, ViewChild }        from        '@angular/core';
import      { DataServices }                from        './services/dataServices.service';
import      { Observable }                  from        'rxjs/Rx';
import      { Volume }                      from        './classes/volume.class';
import      { FormControl }                 from        '@angular/forms';
import      { Http , Response, Jsonp }      from        '@angular/http';
import      { Subscription }                from        'rxjs/Subscription';

@Component({

  selector: 'app-root',
  templateUrl: './templates/appRootComponent.template.html',
  styleUrls:  ['./styles/appRootComponent.style.css'],
  
  providers:  [ DataServices ],

})


export class AppRootClass {
  
    notifications = {

        searchIcoUrl:       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAD1ElEQVRoQ+2ZXVbaQBTH/5dQBX0QhReFc0pXUF2BuILiCqor0K5AXUF1BaUraLoCcQWyg+I5qC9E8aVES3J7BgknhoTMTKBFjrxmZu785n5fCHPyoznhwBuI0OQ9crnfC8Y2UqgyqEyEHIDNgZYbzOgQuAkX5tKTc7GKTmdaFqClkdtMoeISHwBUVbsYm9xzTkp/Og21ffGrlUBuM7myC+MIRHvxR49ZwVxLwTlZtzvNROf4NkuD3Czkq66BbwQS5pP4x+BOysH+xpNlJj4MkHP2m8W1A06lTkMFMl8xwTSYTMfpdTyzab3LbRpGOucQV4lRBdH7sP3kuocbj3dnSWFiNXKzuHbIqdTXoCBmXBjA8brdrstcQviVAxwTYTu4nlz3y8bjXfhDyRwepxFhTmzQj0kKjnoYcng3iZlFakQ4tkPGpd8nGPyAnlNJGnWE2SFt1Am04j2S8BmDnS3dABAJcpPJ15jos18b3OttJYXwzhMwlE5f+s8n5u8btqUVEUNBnvMEzl8ImYAdB000zMx0HysU5DqbNwH6NFQ746JktyuSfqe0rJUp1F8GAP5Z7FqKiTYk/PbLjmz63n+bFGNHNjopUQAI0/5St7eqWs6MaGQkUjFfFW2rrHpBlfXXmXzTn2d0ItgoSMDJGXxW6lqHKhdTXdvK5k8JdODt03H6EZCgzU7TrLyLB81LJFtVnxwBuc4WREj0SnHoRhEVrYSE4kax295SOSMMhP0HFLvt2DJGRWDU2utsIZHc+QVpZQsNAj4Oc8gEs3mUNkZMSyNSzq+zB2us/xF+dWTKJMRm0bY+TMKhIx09k/8FomHSnUhCnJsSRbxaSNFYL9ntnWlopZUpnBNhWJDqZHVxr/ku4wXhtBursKoX0CvhIzUiPgxa3UawHUXP2UnaJQ5a3fNgG73cdcqq5fuw0Bxn92OGD9ojnOjREpvFrrWr64exddSYcVDdAE5kG67BOOjI79gjl2auFW1rXwcmFqTvLxGzrb5A5iYTmQZDDOgeAgO6FYdQJWYxoJNrzjRhpED6MM8j05rfZ3ReTmqPBow0iBcAGMZxcEwkdTnfIpEr+soMjJtenKMIowTiCXquVo1j/6RFBkYAEKjm+VVYiNeF0QLxhIlyprtgVMQfPS6oDELOawH6U0mmBogbYDSWbccMC62TgkkEIqMFmTWTgJkJkKhKQsXMZgYkKcxMgSSBmTkQXZiZBJGBYeb9km3VpIpGmYgzzTVR0Sys+ZpZjXgPFISJ6iBnHsRvZuPa4FcBImBamfye3yeCJv1qQOJ88Q0k7oX+9fe//5NWUftXKbcAAAAASUVORK5CYII='


    };

    @ViewChild('listRef') childRef;

    allVolumes:         Volume[] = [];
    volumes:            Volume[] = [];
    primeryVolume:      Volume   = new Volume('', '', {}, [''],'', '', '', '');

    searchName:         string = '';
    
    volumeCounter:      number = 0;
    
    keyword                    = new FormControl();
    
    loadingTime:        boolean = false;
    endOfList:          boolean = false;
    
    httpRequest:        Subscription;
 
    constructor(private dataServices: DataServices){
  
        this.keyword.valueChanges.debounceTime(600).subscribe((keyword) => {
            
            if(keyword == '') return;

            this.httpRequest = this.dataServices.getPrimeryVolume(keyword, this).subscribe((response) => {

                this.primeryVolume = response;
                
                this.listActivation(keyword);
        
            });

        });
         
    }


    getDataFromService(keyword: string){

         this.dataServices.getAllVolumesFromServer(keyword, this).subscribe((response) => {
         
              this.allVolumes = [];
              this.allVolumes = response;

              this.volumeCounter = 0;

              this.loadingTime = false;
              
              console.log(this.allVolumes);
              this.sendDataToList(0, 10);
              
        });

    }


    listActivation(keyword: string){

        this.childRef.mainSubTitle = keyword;

        this.dataServices.resetList();

        if(keyword == '') return;

        this.searchName = keyword;
        this.childRef.resetList();   

        this.endOfList = false;
        this.loadingTime = true;
                
        if(!this.endOfList)
            this.getDataFromService(keyword);      

    }


    sendDataToList(startIndex: number, amount: number){

        this.volumes = [];

        let response = this.rangeIsValid(this.allVolumes.length, startIndex, amount);

        if(!response['indicator']){
            this.childRef.endOfList = true;
            return;
        } 
        
        amount = response['amount'];

        for(let i = startIndex; i < amount; i ++){
         
            this.volumes.push(this.allVolumes[i]);
            this.volumeCounter ++;
        }

       console.log(this.volumes);
    }


    processDataRequest(event){       
        
        if(this.volumeCounter == this.allVolumes.length){

            console.log('Note: End Of Data!!');
            this.childRef.resetRange();
            
            if(!this.endOfList)
                this.getDataFromService(this.keyword.value);

            return;
        }

        
        this.sendDataToList(event.startIndex, event.amount);
    }

    
    endOfListAlert(){

        this.endOfList = true;
        this.childRef.endOfList = true;

    }


    abortHttpRequest(){ try{this.httpRequest.unsubscribe();} catch(exp) { } }

    
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




}





/*



 


*/