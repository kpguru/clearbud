'use strict';

app.factory('AuthenticationService', function($firebaseAuth, FIREBASE_URL, $firebase) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var firebaseUsers = $firebase(ref.child('users'));

    var Auth = {
        user: {},
        // getCurrentUser : function(userID){
        //     return firebaseUsers.child(userID)).$asObject();
        // },

        createUser : function(uid, user){
            var userInfo = {
                date: Firebase.ServerValue.TIMESTAMP,
                regUser: uid,                
                email: user.email,
                role:user.role,
                phone: user.phone
            };
            firebaseUsers.$set(uid, userInfo);
        },

        login : function(user){
            console.log(user.email, user.password);
            return auth.$authWithPassword(
                {
                    email: user.email,
                    password: user.password
                }, function(error, authData){
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        //console.log("Authenticated successfully with payload:", authData);
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