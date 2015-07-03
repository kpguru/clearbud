'use strict';

app.factory('BookingService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseBooking = $firebase(ref.child('booking'));
    var Booking = {
			  all : firebaseBooking,
        getBooking : function (bookingID) {
          return $firebase(ref.child('booking').child(bookingID));
        },
        cleanerBooking : function (bookingInfo) {
          return firebaseBooking.$push(bookingInfo);
        },
        getCustomerBookings : function (costomer_id) {
          return $firebase(ref.child('booking').orderByChild("customerID").equalTo(costomer_id)).$asArray();
        },
        getCleanerBookings : function (cleaner_id) {
          return $firebase(ref.child('booking').orderByChild("cleanerID").equalTo(cleaner_id)).$asArray();
        },
        updateBookingStatus : function (bookingID,status) {
          var bookingInfo = this.getBooking(bookingID);
          return bookingInfo.$update(status);
        },
        hours : function(){
            var hours = [{name: '3.0 hours', value: '3.0' },
                      {name: '3.5 hours', value: '3.5' },
                      {name: '4.0 hours', value: '4.0' },
                      {name: '4.5 hours', value: '4.5' },
                      {name: '5.0 hours', value: '5.0' }
                      ];
            return hours;
                }
    }
    return Booking;
});
