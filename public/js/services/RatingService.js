'use strict';

app.factory("RatingService", function ($firebase, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var firebaseCustomersRating = $firebase(ref.child('booking'));
    var rating = {
        addCustomersRating: function (rating) {
            rating.date = Firebase.ServerValue.TIMESTAMP;
            var t = $firebase(ref.child('booking').child(rating.booking_id).child('rating'));
            return t.$push(rating);
        },
        getCleanerRatings : function(cleanerID){

            return $firebase(ref.child('booking').orderByChild("cleanerID").equalTo(cleanerID)).$asArray();
        }
    }
    return rating;
});

       
