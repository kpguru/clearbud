'use strict';

app.factory('AdminService',function($firebase, FIREBASE_URL){
   
    var ref = new Firebase(FIREBASE_URL);
    var firebaseAdmin = $firebase(ref.child('users')).$asArray();
    var admin = {
        updateCleanerStatus : function (cleanerID,status) {
        	var cleanerInfo = $firebase(ref.child('users').child(cleanerID));
            return cleanerInfo.$update(status);
        }
    }  
    return admin; 
});
