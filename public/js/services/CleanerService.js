'use strict';

app.factory('CleanerService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var cleanerEdit;
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
        },
       getCurrentStepIndex : function(steps,selection){
              // Get the index of the current step given selection
              return _.indexOf(steps, selection);
            },
   
        goToStep : function(index, steps,selection) {
                  if ( !_.isUndefined(steps[index]) )
                  {
                   selection = steps[index];
                  }
                },
        No_of_bedRoom : function(){
            var bedroom = [{name: '1 Bedroom', value: '1 Bedroom' },
                      {name: '2 Bedroom', value: '2 Bedroom' },
                      {name: '3 Bedroom', value: '3 Bedroom' },
                      {name: '4 Bedroom', value: '4 Bedroom' },
                      {name: '5 Bedroom', value: '5 Bedroom' }
                      ];  
            return bedroom
        },
        No_of_bathRoom : function(){
            var bathroom = [{name: '1 Bathroom', value: '1 Bathroom' },
                      {name: '2 Bathroom', value: '2 Bathroom' },
                      {name: '3 Bathroom', value: '3 Bathroom' },
                      {name: '4 Bathroom', value: '4 Bathroom' }
                      ];
            return bathroom;
                  },
        frequency: function(){
                var frequency = [{name: 'Weekly', value: 'weekly' },
                      {name: 'Every 2 Weekly', value: 'every_two_weeks' },
                      {name: 'Every 4 Weeks', value: 'every_four_weeks' },
                      {name: 'One Time', value: 'one_time' }
                      ];
                return frequency;
                  },
        steps :function(){
               var steps =  [
              'Personal Info',
              'Company Address',
              'Campaign Info',
              'submit'
            ];
            return steps;
        },
        steps1 : function(){
            var steps1 =["Reviews",
                  "About",
                  "What's Included",
                  'Pricing',
                  'Availability'
                ];
            return steps1;
        },
        setRendering : function(updateProfile){
           cleanerEdit = updateProfile;
        },
        getRendering : function(){
           return cleanerEdit;
        }
    }
        return Cleaner;
     });