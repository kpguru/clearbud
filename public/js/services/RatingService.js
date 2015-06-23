'use strict';

app.factory("RatingService", function ($firebase, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var firebaseCustomersRating = $firebase(ref.child('rating'));
    var rating = {
        addCustomersRating: function (rating) {
            rating.date = Firebase.ServerValue.TIMESTAMP;
            return firebaseCustomersRating.$push(rating);
        },
        getCleanerRatings : function(cleanerID){
            return $firebase(ref.child('rating').orderByChild("cleaner_id").equalTo(cleanerID)).$asArray();
        }
    }
    return rating;
});