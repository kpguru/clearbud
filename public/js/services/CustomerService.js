'use strict';

app.factory("CustomerService", function ($firebase, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var firebaseCustomers = $firebase(ref.child('users')).$asArray();
    var setBookingInfo;
    var customer = {
    	getCustomer : function (customerID) {
            return $firebase(ref.child('users').child(customerID));
        },
        updateCustomer : function (customerID,editCustomer) {
          var customerInfo = this.getCustomer(customerID);
          return customerInfo.$update(editCustomer);
        },
        setBooking : function(booking){
            setBookingInfo = booking;
        },
        getBooking : function(){
            return setBookingInfo;
        }
    }
    return customer;
});