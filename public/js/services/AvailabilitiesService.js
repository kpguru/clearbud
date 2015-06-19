'use strict';

app.factory('AvailabilitiesService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var firebaseAvailabilities = $firebase(ref.child('availabilities'));

    var cleanerAvailabilities = {
        getCAById : function (availabilityID) {
            return $firebase(ref.child('availabilities').child(availabilityID));
        },
    	getCleanerAvailabilities : function (cleanerID) {
            return $firebase(ref.child('availabilities').orderByChild("cleaner_id").equalTo(cleanerID)).$asArray();
        },
    	addCleanerAvailabilities: function (availabilities) {
            console.log(availabilities);
            return firebaseAvailabilities.$push(availabilities);
        },
        updateCleanerAvailabilities : function(id, availability){
           var cp = this.getCAById(id);
           return cp.$update(availability);
        }
    }
    return cleanerAvailabilities;
});