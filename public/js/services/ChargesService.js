'use strict';

  app.factory('ChargesService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var firebaseCharges = $firebase(ref.child('charges'));
    var cleanerCharges = {
      getChargesById : function (chargeID) {
        return $firebase(ref.child('charges').child(chargeID));
      },
      getCharges : function (cleanerID) {
        return $firebase(ref.child('charges').orderByChild("cleaner_id").equalTo(cleanerID)).$asArray();
      },
      addCleanerCharges: function (charges) {
        return firebaseCharges.$push(charges);
      },
      UpdateCharges: function (ID,charges) { 
        var cp = this.getChargesById(ID);
        return cp.$update(charges);
      }
    }
    return cleanerCharges;
  });
