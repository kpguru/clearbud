'use strict';

app.factory('SearchService', function($rootScope, $firebaseAuth, $q, $window, FIREBASE_URL,
                                             AuthenticationService) {

    var ref = new Firebase(FIREBASE_URL + '/search');
    //~ var teamData = TeamService.all;
    //~ var scoreboardData = ScoreboardService.all;
    //~ var schoolData = SchoolService.all;
    //~ var leagueData = LeagueService.all;
    //~ var favoritesData = FavoriteService.getUserFav(User().uid).$asArray();
    function User(){
        var ref = new Firebase(FIREBASE_URL);
        var user = $firebaseAuth(ref);
        var authData = user.$getAuth();
        return authData;
    }

    var ElasticSerach = {
        // display search results
        searchFromDB: function(index, term, name, words){
            var deferred = $q.defer();
            this.doSearch(index, name, this.buildQuery(term, words), function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },

        doSearch: function(index, type, query, callback){
            var key = ref.child('request').push({index: index, type: type, query: query});
            console.log('search', key.key(), { index: index, type: type, query: query });
            ref.child('response/' + key.key()).on('value', function fn(snap) {
						console.log('result', snap.val());
                if (snap.val() !== null) {
                    snap.ref().off('value', fn);
                    console.log(snap.ref());
                    snap.ref().remove();
                    callback(snap.val());
                }
            });
        },

        buildQuery: function(term, words) {
            // See this tut for more query options:
            // http://okfnlabs.org/blog/2013/07/01/elasticsearch-query-tutorial.html#match-all--find-everything
            return {
                'query_string': {query: this.makeTerm(term, words)}
            };
        },

        makeTerm: function(term, matchWholeWords) {
            if (!matchWholeWords) {
                if (!term.match(/^\*/)) {
                    term = '*' + term;
                }
                if (!term.match(/\*$/)) {
                    term += '*';
                }
            }
            return term;
        }
     }
      return ElasticSerach;
    });
		
