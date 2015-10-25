var dueamici = angular.module('dueamici', ['ui.router',
    'ngSanitize',
    'dueamici.controllers',
    'firebase',
    'textAngular',
    'angular-carousel'])
.factory('StateData', function () {

    var data = {
        state: 'app.homepage'
    };

    return {
        getState: function () {
            return data.state;
        },
        setState: function (_state) {
            data.state = _state;
        }
    };
})
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://dueamici.firebaseio.com");
    return $firebaseAuth(ref);
  }
])


    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/frame.html',
                controller: 'MainCtrl',
            })
            .state('admin', {
                url: '/admin',
                abstract: true,
                templateUrl: 'templates/admin.html',
                controller: 'AdminCtrl',
                resolve: {
                      // controller will not be loaded until $waitForAuth resolves
                      // Auth refers to our $firebaseAuth wrapper in the example above
                      "currentAuth": ["Auth", function(Auth) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError (see above)
                                return Auth.$requireAuth();
                      }]
                }
            })
            .state('app.homepage', {
                url: '/home',
                views: {
                    'content': {
                        templateUrl: 'templates/splash.html',
                        controller: 'HomeCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.restaurant', {
                url: '/restaurant',
                views: {
                    'content': {
                        templateUrl: 'templates/restaurant.html',
                        controller: 'RestaurantCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.food', {
                url: '/food',
                views: {
                    'content': {
                        templateUrl: 'templates/menu.html',
                        controller: 'FoodCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.blog', {
                url: '/blog',
                views: {
                    'content': {
                        templateUrl: 'templates/blog.html',
                        controller: 'BlogCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.post', {
                url: '/post/:id',
                views: {
                    'content': {
                        templateUrl: 'templates/post.html',
                        controller: 'PostCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.contact', {
                url: '/contact',
                views: {
                    'content': {
                        templateUrl: 'templates/contact.html',
                        controller: 'ContactCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.reservation', {
                url: '/reservation',
                views: {
                    'content': {
                        templateUrl: 'templates/reservation.html',
                        controller: 'ReservationCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'content': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('admin.home', {
                url: '/',
                views: {
                    'content': {
                        templateUrl: 'templates/admin_home.html',
                        controller: 'AdminHomeCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/admin_navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('admin.deals', {
                url: '/deals',
                views: {
                    'content': {
                        templateUrl: 'templates/admin_deals.html',
                        controller: 'AdminDealsCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/admin_navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('admin.contact', {
                url: '/contact',
                views: {
                    'content': {
                        templateUrl: 'templates/admin_contact.html',
                        controller: 'AdminContactCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/admin_navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })
            .state('admin.reservations', {
                url: '/reservations',
                views: {
                    'content': {
                        templateUrl: 'templates/admin_reservations.html',
                        controller: 'AdminReservationsCtrl'
                    },
                    'menu': {
                        templateUrl: 'templates/admin_navbar.html',
                        controller: 'MenuCtrl'
                    }
                }
            })




        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    })
    .run(["$rootScope", "$state","StateData", function($rootScope, $state,StateData) {
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            console.log("ERROR",error);
          // We can catch the error thrown when the $requireAuth promise is rejected
          // and redirect the user back to the home page
          if (error === "AUTH_REQUIRED") {
            StateData.setState(toState.name);
            $state.go("app.login");
          }
        });
}]);
;