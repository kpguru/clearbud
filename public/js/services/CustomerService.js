'use strict';

  app.factory("CustomerService", function ($firebase, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var firebaseCustomers = $firebase(ref.child('users')).$asArray();
    var data;
    var customer = {
    	getCustomer : function (customerID) {
        return $firebase(ref.child('users').child(customerID));
      },
      updateCustomer : function (customerID,editCustomer) {
        var customerInfo = this.getCustomer(customerID);
        return customerInfo.$update(editCustomer);
      },
      setData : function(info){
        data = info;
      },
      getData : function(){
        return data;
      }
    }
    return customer;
  });
