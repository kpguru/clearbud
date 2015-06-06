'use strict';

app.factory('CleanerService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseUsers = $firebase(ref.child('users'));
    var Cleaner = {
         getCleaner : function (cleanerID) {
            return $firebase(ref.child('users').child(cleanerID));
        },
        createCP : function (ID, profile) {
            var cp = this.getCleaner(ID);
            return cp.$update(profile);
        },
        updateCP : function (ID, cleaner) {
             var cleanerData = {
                    firstname :cleaner.firstname,
                    lastname :cleaner.lastname,
                    phone : cleaner.phone,
                    email : cleaner.email,
                    address1 :cleaner.address1,
                    address2: cleaner.address2,
                    city : cleaner.city,
                    state : cleaner.state,
                    zip_code: cleaner.zip_code,
                    company_name : cleaner.company_name,
                    month_in_business : cleaner.month_in_business,
                    team_member : cleaner.team_member
             }; 
            var cp = this.getCleaner(ID);
            return cp.$update(cleanerData);
        },
    }
    return Cleaner;
 });