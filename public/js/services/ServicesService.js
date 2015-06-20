'use strict';

app.factory('ServicesService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var firebaseServices = $firebase(ref.child('services'));

    var cleanerServices = {
        getServicesById : function (serviceID) {
            return $firebase(ref.child('services').child(serviceID));
        },
        getServices: function (cleanerID){
            return $firebase(ref.child('services').orderByChild("cleaner_id").equalTo(cleanerID)).$asArray();
        },
        addCleanerServices: function (service) {
            return firebaseServices.$push(service);
        },
        updateCleanerServices : function(id, services){
           var cp = this.getServicesById(id);
           return cp.$update(services);
        }
    }
    return cleanerServices;
});