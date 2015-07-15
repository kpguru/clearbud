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
      },
      availabilities : function(){
        var Availabilities = [{name: 'Sunday', value: 'Sunday' },
                  {name: 'Monday', value: 'Monday' },
                  {name: 'Tuesday', value: 'Tuesday' },
                  {name: 'Wednesday', value: 'Wednesday' },
                  {name: 'Thusday', value: 'Thusday' },
                  {name: 'Friday', value: 'Friday' },
                  {name: 'Saturday', value: 'Saturday' },
                  {name: 'Everyday', value: 'Everyday' },
                  {name: 'Weekends', value: 'Weekends' },
                  {name: 'Monday-Friday', value: 'Monday-Friday' }
                  ];
        return Availabilities;
      }
    }
    return customer;
  });
