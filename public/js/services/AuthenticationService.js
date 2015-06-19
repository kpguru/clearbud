'use strict';

app.factory('AuthenticationService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseUsers = $firebase(ref.child('users'));
    var isCleaner = '';

    var Auth = {
        user: {},       
        getCurrentUser : function(userID){
            return $firebase(ref.child('users').child(userID)).$asObject();
        },
        createUser : function(uid, user){
            var userInfo = {
                date: Firebase.ServerValue.TIMESTAMP,
                regUser: uid,                
                email: user.email,
                role:user.role,
                phone: user.phone,
                isApproved: user.isApproved
            };
            firebaseUsers.$set(uid, userInfo);
        },
        getUsersByRole: function(userRole){
            return $firebase(ref.child('users').orderByChild("role").equalTo(userRole)).$asArray();
        },

        login : function(user){
            return auth.$authWithPassword(
                {
                    email: user.email,
                    password: user.password
                }, function(error, authData){
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        return authData;
                    }
                });
        },

        signup : function(user){
            return auth.$createUser({
                    email: user.email,
                    password: user.password
                }).then(function () {
                    return Auth.login(user);
                }).then(function (data) {
                    return Auth.createUser(data.uid, user);
                });
        },
        logout : function(){
            return auth.$unauth();
        }, 
         signedIn : function(){
            return !!Auth.user.provider;
        },
        requireAuth : function(){
            return auth.$requireAuth();
        }
      

    };

    auth.$onAuth(function(authData){
        if(authData){
            angular.copy(authData, Auth.user);
            Auth.user.userInfo = $firebase(ref.child('users').child(authData.uid)).$asObject();
        }else{
            if(Auth.user && Auth.user.userInfo){
                Auth.user.userInfo.$destroy();
            }
            angular.copy({}, Auth.user);
        }
    });

    return Auth;
});