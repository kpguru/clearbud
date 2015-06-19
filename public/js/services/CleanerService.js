'use strict';

app.factory('CleanerService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseUsers = $firebase(ref.child('users'));
    var Cleaner = {
         getCleaner : function (cleanerID) {
            return $firebase(ref.child('users').child(cleanerID));
        },
        getCleanerByName : function(cleaner){
            return $firebase(ref.child('users').orderByChild("firstname").equalTo(cleaner)).$asArray();
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
                    team_member : cleaner.team_member,
                    cleaner_logo: cleaner.cleaner_logo
             }; 
            var cp = this.getCleaner(ID);
            return cp.$update(cleanerData);
        },
        saveCleanerAbout : function(ID,about){
            var ca = this.getCleaner(ID);
            return ca.$update(about);
        },
         formatDate: function (input_date) {
            var year = input_date.getFullYear() + "";
            var month = (input_date.getMonth() + 1) + "";
            var day = input_date.getDate() + "";
            var format_date = day + "/" + month + "/" + year;
            return format_date
        },
        formatTime: function (input_time) {
            var hours24 = parseInt(input_time.getHours());
            var minutes = (input_time.getMinutes()) + "";
            var am_pm = hours24<12 ? "AM" : "PM";
            var hour = (((hours24 + 11) % 12) + 1);
            var format_time= hour + ":" + minutes + am_pm;
            return format_time;
        }
    }
    return Cleaner;
 });