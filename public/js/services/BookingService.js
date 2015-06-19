'use strict';

app.factory('BookingService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseBooking = $firebase(ref.child('booking'));
    var Booking = {
         cleanerBooking : function (bookingInfo) {
            return firebaseBooking.$push(bookingInfo);
        }
    }
    return Booking;
});