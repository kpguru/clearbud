'use strict';

  app.factory('SearchService', function($firebaseAuth, FIREBASE_URL, $firebase , CustomerService, AuthenticationService, RatingService, ChargesService, AvailabilitiesService) {
    var cleanerData =[];
    var cleanerInfo = [];
    var availabilities1;
    
    return {
      //get all cleaners profile like name, availabilities, rating, charge on search page
      getCleanersProfile : function (flag,cleaners,search,callback) {
        var i = 0;
        cleanerData =[];
        angular.forEach(cleaners, function(cleaner){
          var clanerAvailabilities = AvailabilitiesService.getCleanerAvailabilities(cleaner.$id);
          clanerAvailabilities.$loaded().then(function (availabilities) {  
            var clanerCharges = ChargesService.getCharges(cleaner.$id);
            clanerCharges.$loaded().then(function (charges) {
              if(charges[0]){          
                var clanerRating = RatingService.getCleanerRatings(cleaner.$id);
                clanerRating.$loaded().then(function (data) {
                  if(data.length > 0){
                    var c = 0;
                    var r = 0;
                    var average_rating = 0;
                    var sum = 0;
                    angular.forEach(data, function(value){
                      if(value.rating){
                        angular.forEach(value.rating, function(value1){
                          sum = sum + parseInt(value1.average_rating); 
                          c++;
                        })
                      }
                    });
                    average_rating = Math.round(sum / c); 
                    r++;
                  }
                  if(Number.isNaN(average_rating))
                  {
                     average_rating = 0;
                  }
                  if(flag){
                    cleanerData.push({score:cleaner.score,firstname:cleaner.firstname,lastname:cleaner.lastname,cleaner_id:cleaner.$id,isApproved:cleaner.isApproved,cleaner_logo:cleaner.cleaner_logo,cleaner_charge:charges[0].one_time,cleaner_availabilities:availabilities,cleaner_rating:average_rating});                
                    CustomerService.setData(cleanerData);
                    callback(cleanerData);
                  }else{
                    if(search.availability){
                      angular.forEach(availabilities[0], function(value1){
                          if(value1 && value1 != null && value1.day){
                            if(value1.day == search.availability){
                              availabilities1 =availabilities;
                              cleanerData.push({zip_code:cleaner.zip_code,score:cleaner.score,firstname:cleaner.firstname,lastname:cleaner.lastname,cleaner_id:cleaner.$id,isApproved:cleaner.isApproved,cleaner_logo:cleaner.cleaner_logo,cleaner_charge:charges[0].one_time,cleaner_availabilities:availabilities1,cleaner_rating:average_rating});
                            }
                          }
                      }); 
                    }else{
                      cleanerData.push({zip_code:cleaner.zip_code,score:cleaner.score,firstname:cleaner.firstname,lastname:cleaner.lastname,cleaner_id:cleaner.$id,isApproved:cleaner.isApproved,cleaner_logo:cleaner.cleaner_logo,cleaner_charge:charges[0].one_time,cleaner_availabilities:availabilities,cleaner_rating:average_rating});
                      }
                  cleanerInfo =[];
                  if(search.name){
                    angular.forEach(cleanerData, function(value){
                      if(value.firstname == search.name){
                        cleanerInfo.push(value);
                      }
                    });
                    CustomerService.setData(cleanerInfo);
                   callback(cleanerInfo);
                  }else{
                    callback(cleanerData);
                    }
                 }
                });
              }
            });
          });
        });
      }
    };
  });
