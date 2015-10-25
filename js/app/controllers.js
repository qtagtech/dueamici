angular.module('dueamici.controllers', [])
.controller('MainCtrl',['$state',function($state){
angular.element(document).ready(function () {
		console.log("angular ready");
		$('document').ready(function($) {
			prepareDocument($);
		});
	    windowLoaded();	
	    });
}])
.controller('HomeCtrl',['$scope','$state','$timeout',function($scope,$state,$timeout){
	
}])
.controller('RestaurantCtrl',['$scope','$state','$timeout','$firebaseArray','$firebaseObject',function($scope,$state,$timeout,$firebaseArray,$firebaseObject){
	$scope.items2 = [1,2,3,4,5,6,7,8,9,10];
	var aRef = new Firebase('https://dueamici.firebaseio.com/articles');
	var dRef = new Firebase('https://dueamici.firebaseio.com/deals');
	$scope.article = null;
	$scope.deals = [];
	$scope.articles = $firebaseArray(aRef);
	$scope.articles.$loaded(function(data){
		$scope.article = $scope.articles[0];
	});
	$scope.deals = $firebaseArray(dRef);
	$scope.deals.$loaded(function(data){
		//initCarousel();
	});
	

}])
.controller('FoodCtrl',['$scope','$state','$timeout',function($scope,$state,$timeout){
	
}])
.controller('BlogCtrl',['$scope','$state','$timeout','$firebaseArray','$firebaseObject',function($scope,$state,
	$timeout,$firebaseArray,$firebaseObject){
	var aRef = new Firebase('https://dueamici.firebaseio.com/articles');
	$scope.articles = $firebaseArray(aRef);
	$scope.articles.$loaded(function(data){
	});
}])
.controller('PostCtrl',['$scope','$state','$timeout','$firebaseArray','$firebaseObject','$stateParams',function($scope,$state,
	$timeout,$firebaseArray,$firebaseObject,$stateParams){
	console.log("PARAMS",$stateParams)
	var aRef = new Firebase('https://dueamici.firebaseio.com/articles').child($stateParams.id);
	$scope.article = $firebaseObject(aRef);
	$scope.article.$loaded(function(data){
		console.log("ARTICULO",$scope.article);
	});
}])
.controller('ContactCtrl',['$scope','$state','$timeout','$firebaseArray','$firebaseObject','$stateParams',function($scope,$state,
	$timeout,$firebaseArray,$firebaseObject,$stateParams){
	$scope.contact = null;
	$scope.sent = false;
	$scope.saveMessage = function(event){
		event.preventDefault();
		var cRef = new Firebase('https://dueamici.firebaseio.com/messages');
		var messages = $firebaseArray(cRef);
		$scope.contact.read = false;
		messages.$add($scope.contact).then(function(ref){
			$scope.sent = true;
			$scope.contact = null;
		}).catch(function(error){
			console.log("ERROR SAVING MESSAGE: ",error)
		});

	};

}])
.controller('ReservationCtrl',['$scope','$state','$timeout','$firebaseArray','$firebaseObject','$stateParams',function($scope,$state,
	$timeout,$firebaseArray,$firebaseObject,$stateParams){
	$scope.reservation = null;
	$scope.sent = false;
	$scope.saveMessage = function(event){
		event.preventDefault();
		var cRef = new Firebase('https://dueamici.firebaseio.com/reservations');
		var reservations = $firebaseArray(cRef);
		$scope.reservation.read = false;
		reservations.$add($scope.reservation).then(function(ref){
			$scope.sent = true;
			$scope.reservation = null;
		}).catch(function(error){
			console.log("ERROR SAVING RESERVATION: ",error)
		});

	};

}])
.controller('MenuCtrl',['$scope','$state','$timeout',function($scope,$state,$timeout){
	$scope.$on('$stateChangeSuccess',function(){
		$('document').ready(function($) {
			prepareDocument($);
		});
	    windowLoaded();	
	});
	
}])

//Admin Controllers
.controller('LoginCtrl',['$scope','$state','$timeout','$firebaseAuth','StateData',function($scope,$state,$timeout,$firebaseAuth,StateData){
	var ref = new Firebase("https://dueamici.firebaseio.com");
    auth = $firebaseAuth(ref);
	$scope.authData = null;
    $scope.error = null;
    $scope.gotoState = 'admin.home'
	$scope.doLogin = function(event){
		event.preventDefault();
      	auth.$authWithPassword({
			  email: $scope.authData.email,
			  password: $scope.authData.password
			}).then(function(authData) {
			  console.log("Logged in as:", authData.uid);
			  $state.go($scope.gotoState);
			}).catch(function(error) {
			  console.error("Authentication failed:", error);
			  alert("Error");
			});
	};
	 
	
}])
.controller('AdminCtrl',['$scope','$state','$timeout','currentAuth','$firebaseAuth','$firebaseArray',function($scope,$state,$timeout,
	currentAuth,$firebaseAuth,$firebaseArray){

	var ref = new Firebase("https://dueamici.firebaseio.com");
    auth = $firebaseAuth(ref);
	$scope.currentUser = currentAuth;
	var cRef = new Firebase('https://dueamici.firebaseio.com/messages');
	$scope.mensajes = $firebaseArray(cRef);
	$scope.mensajes.$loaded().then(function(data){
		$scope.mensajes.$watch(function(event) {
		  //console.log("CAMBIO en el servidor: ",event);
		  if(event.event === "child_added"){
		  	var audio = document.getElementsByTagName("audio")[0];
			audio.play();
		  	var r = confirm("Nuevo Mensaje!\n Leer ahora?");
			if (r == true) {
			    $state.go('admin.contact');
			} else {
			    
			}
		  }
		});
	});

	var rRef = new Firebase('https://dueamici.firebaseio.com/reservations');
	$scope.reservas = $firebaseArray(rRef);
	$scope.reservas.$loaded().then(function(data){
		$scope.reservas.$watch(function(event) {
		  //console.log("CAMBIO en el servidor: ",event);
		  if(event.event === "child_added"){
		  	var audio = document.getElementsByTagName("audio")[1];
			audio.play();
		  	var r = confirm("Nueva Reserva!\n Ver ahora?");
			if (r == true) {
			    $state.go('admin.reservations');
			} else {
			    
			}
		  }
		});
	});


	$scope.doLogout = function(){
		auth.$unauth();
		$state.go('app.homepage');
	};
	
}])
.controller('AdminHomeCtrl',['$scope','$state','$timeout','currentAuth','$firebaseObject','$firebaseArray',function($scope,$state,$timeout,
	currentAuth,$firebaseObject,$firebaseArray){
	$scope.editing = false;
	$scope.articles = [];
	$scope.article = null;
	var aRef = new Firebase('https://dueamici.firebaseio.com/articles');
	$scope.articles = $firebaseArray(aRef);
	$scope.articles.$loaded().then(function(data){
		console.log("ARTICLES: ",data);
	}).catch(function(error){
		console.log("ERROR RETRIEVING ARTICLES: ",error);
	});
	$scope.saveArticle = function(event){
		event.preventDefault();
		if(!$scope.editing){
			var d = new Date();
			$scope.article.date = d.getTime()
			$scope.articles.$add($scope.article);
			$scope.article = null;
			console.log("Articulo",$scope.article);
		}else{
			$scope.articles.$save($scope.article);
		}	
	};

	$scope.editArticle = function(event,article){
		$scope.editing = true;
		$scope.article = article;
	};
	$scope.setNewArticle = function(){
		$scope.article = null;
		$scope.editing = false;
		
	};


}])
.controller('AdminDealsCtrl',['$scope','$state','$timeout','currentAuth','$firebaseObject','$firebaseArray',function($scope,$state,$timeout,
	currentAuth,$firebaseObject,$firebaseArray){
	$scope.editing = false;
	$scope.deals = [];
	$scope.deal = null;
	var aRef = new Firebase('https://dueamici.firebaseio.com/deals');
	$scope.deals = $firebaseArray(aRef);
	$scope.deals.$loaded().then(function(data){
		console.log("DEALS: ",data);
	}).catch(function(error){
		console.log("ERROR RETRIEVING DEALS: ",error);
	});
	$scope.saveDeal = function(event){
		event.preventDefault();
		if(!$scope.editing){
			$scope.deals.$add($scope.deal);
			$scope.deal = null;
			console.log("DEAL",$scope.deal);
		}else{
			$scope.deals.$save($scope.deal);
		}	
	};

	$scope.editDeal = function(event,deal){
		$scope.editing = true;
		$scope.deal = deal;
	};
	$scope.setNewDeal = function(){
		$scope.deal = null;
		$scope.editing = false;
		
	};


}])
.controller('AdminContactCtrl',['$scope','$state','$timeout','currentAuth','$firebaseObject','$firebaseArray',function($scope,$state,$timeout,
	currentAuth,$firebaseObject,$firebaseArray){

	$scope.currentMessage = null;
	var cRef = new Firebase('https://dueamici.firebaseio.com/messages');
	$scope.messages = $firebaseArray(cRef);
	$scope.messages.$loaded().then(function(data){
	});
	$scope.setCurrentMessage = function(event,message){
		event.preventDefault();
		message.read = true;
		$scope.messages.$save(message);
		$scope.currentMessage = message;
	};

}])
.controller('AdminReservationsCtrl',['$scope','$state','$timeout','currentAuth','$firebaseObject','$firebaseArray',function($scope,$state,$timeout,
	currentAuth,$firebaseObject,$firebaseArray){

	$scope.currentReservation = null;
	var cRef = new Firebase('https://dueamici.firebaseio.com/reservations');
	$scope.reservations = $firebaseArray(cRef);
	$scope.reservations.$loaded().then(function(data){
	});
	$scope.setCurrentReservation = function(event,reservation){
		event.preventDefault();
		reservation.read = true;
		$scope.reservations.$save(reservation);
		$scope.currentReservation = reservation;
	};

}])
;

