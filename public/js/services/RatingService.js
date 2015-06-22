'use strict';

app.factory("RatingService", function ($firebase, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var firebaseCustomersRating = $firebase(ref.child('rating'));
    var rating = {
    	getCustomerRating : function (customerID) {
            return $firebase(ref.child('rating').child(customerID));
        },
        addCustomersRating: function (rating) {
            return firebaseCustomersRating.$push(rating);
        }
    }
    return rating;
});