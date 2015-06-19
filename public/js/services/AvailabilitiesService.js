'use strict';

app.factory('AvailabilitiesService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var firebaseAvailabilities = $firebase(ref.child('availabilities'));

    var cleanerAvailabilities = {
    	getCleanerAvailabilities : function (cleanerID) {
            return $firebase(ref.child('availabilities').orderByChild("cleaner_id").equalTo(cleanerID)).$asArray();
        },
    	addCleanerAvailabilities: function (availabilities) {
            return firebaseAvailabilities.$push(availabilities);
        }
    }
    return cleanerAvailabilities;
});