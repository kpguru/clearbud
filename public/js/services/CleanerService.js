'use strict';

app.factory('CleanerService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseUsers = $firebase(ref.child('users'));
    var Cleaner = {
         getCleaner : function (cleanerID) {
            return $firebase(ref.child('users').child(cleanerID));
        },
        updateCP : function (ID, profile) {
            var cp = this.getCleaner(ID);
            return cp.$update(profile);
        },
    }
    return Cleaner;
 });