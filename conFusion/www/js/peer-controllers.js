angular.module('conFusion.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = $localStorage.getObject('userinfo', '{}');
        $scope.reservation = {};
        $scope.registration = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Create the reserve modal
        $ionicModal.fromTemplateUrl('templates/reserve.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.reserveform = modal;
        });

        // Create the registration modal
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.registerForm = modal;
        });

        $scope.closeRegister = function () {
            $scope.registerForm.hide();
        };

        $scope.register = function () {
            $scope.registerForm.show();
        }

        $scope.closeReserve = function() {
            $scope.reserveform.hide();
        };

        $scope.reserve = function() {
            $scope.reserveform.show();
        };

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        $scope.doReserve = function() {
            console.log('Doing reservation', $scope.reservation);

            $timeout(function() {
                $scope.closeReserve();
            }, 1000);
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
            $localStorage.storeObject('userinfo', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };

        $scope.doRegister = function () {
            console.log('Doing reservation ', $scope.reservation);

            $timeout(function () {
                $scope.closeRegister();
            }, 1000);
        };

        $ionicPlatform.ready(function () {
            var cameraOptions = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            var pickPictureOptions = {
                maximumImagesCount: 1,
                width: 100,
                height: 100,
                quality: 50
            };

            $scope.takePicture = function () {
                $cordovaCamera.getPicture(cameraOptions).then(function (imageData) {
                    $scope.registration.imgSrc = imageData;
                }, function (err) {
                    console.log(err);
                });
                $scope.registerForm.show();
            };

            $scope.pickPicture = function () {
                $cordovaImagePicker.getPictures(pickPictureOptions).then(function (results) {
                    $scope.registration.imgSrc = results[0];
                }, function (err) {
                    console.log(err)
                });
            };
        });
    })

    // Controlador del menú
    .controller(
        "MenuController",
        [
            '$scope',
            'dishes',
            'favoriteFactory',
            'baseURL',
            '$ionicListDelegate',
            '$ionicPlatform',
            '$cordovaLocalNotification',
            '$cordovaToast',
            function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast){
                $scope.baseURL = baseURL;
                $scope.tab = 1;
                $scope.filtText = '';
                $scope.showDetails = false;
                $scope.showMenu = false;
                $scope.message = "Loading...";

                $scope.dishes = dishes;

                $scope.select = function(setTab){
                    $scope.tab = setTab;

                    if (setTab === 2)
                        $scope.filtText = "appetizer";
                    else if(setTab === 3)
                        $scope.filtText = "mains";
                    else if(setTab === 4)
                        $scope.filtText = "dessert";
                    else
                        $scope.filtText = "";
                };

                $scope.isSelected = function(checkTab){
                    return ($scope.tab === checkTab);
                };

                $scope.toggleDetails = function() {
                    $scope.showDetails = !$scope.showDetails;
                };

                $scope.addFavorite = function(index) {
                    console.log("Index is " + index);

                    favoriteFactory.addToFavorites(index);
                    $ionicListDelegate.closeOptionButtons();

                    $ionicPlatform.ready(function () {
                        $cordovaLocalNotification.schedule({
                            id: 1,
                            title: "Added Favorite",
                            text: $scope.dishes[index].name
                        }).then(function () {
                            console.log('Added Favorite ' + $scope.dishes[index].name);
                        },
                        function () {
                            console.log('Failed to add Notification ');
                        });

                        $cordovaToast.show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                        .then(function (success) {
                            // success
                        }, function (error) {
                              // error
                        });
                    });
                };
            }
        ]
    )

    // Controlador del la pantalla de contacto
    .controller('ContactController', ['$scope', function($scope){
        $scope.feedback = {
            mychannel: "",
            firstName: "",
            lastName: "",
            agree: false,
            emailid: ""
        };

        var channels = [
            {value: "tel", label: "Tel."},
            {value: "Email", label: "Email"}
        ];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;
    }])

    // Controlador del formulario de retroalimentación
    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory){

        $scope.sendFeedback = function() {

            if($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
            } else {
                $scope.invalidChannelSelection = false;

                var feedback = new feedbackFactory.getFeedback();
                feedback.save($scope.feedback);

                $scope.feedback = {
                    mychannel: "",
                    firstName: "",
                    lastName: "",
                    agree: false,
                    email: ""
                };
                $scope.feedbackForm.$setPristine();
            }
        };

    }])

    // Controlador de los detalles de un platillo del menú
    .controller('DishDetailController',
        [
            '$scope',
            '$ionicModal',
            '$stateParams',
            'dish',
            'menuFactory',
            'baseURL',
            '$ionicPopover',
            'favoriteFactory',
            '$ionicPlatform',
            '$cordovaLocalNotification',
            '$cordovaToast',
            function($scope, $ionicModal, $stateParams, dish, menuFactory, baseURL, $ionicPopover, favoriteFactory, $ionicPlatform, $cordovaLocalNotification, $cordovaToast){
                $scope.baseURL = baseURL;
                $scope.showDish = false;
                $scope.message = "Loading...";
                $scope.comment = {};

                $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                    scope: $scope
                }).then(function(popover) {
                    $scope.popover = popover;
                });

                $ionicModal.fromTemplateUrl('templates/dish-detail-comment-form.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.commentModal = modal;
                });

                $scope.dish = dish;
                $scope.orderText = "";

                $scope.openDishDetailPopover = function ($event) {
                    $scope.popover.show($event);
                };

                $scope.showCommentModal = function () {
                    $scope.commentModal.show();
                };

                $scope.closeComment = function () {
                    $scope.commentModal.hide();
                };

                $scope.addFavorite = function() {
                    console.log("Index is " + parseInt($stateParams.id, 10));

                    favoriteFactory.addToFavorites(parseInt($stateParams.id, 10));
                    $scope.popover.hide();

                    $ionicPlatform.ready(function () {
                        $cordovaLocalNotification.schedule({
                            id: 1,
                            title: "Added Favorite",
                            text: $scope.dish.name
                        }).then(function () {
                            console.log('Added Favorite ' + $scope.dish.name);
                        }, function () {
                            console.log('Failed to add Notification');
                        });
                    });

                    $cordovaToast.show('Added Favorite ' + $scope.dish.name, 'long', 'bottom')
                    .then(function (success) {
                        // success
                    }, function (error) {
                        // error
                    });
                };

                $scope.comment = function () {
                    $scope.dish.comments.push({
                        rating: $scope.comment.rating,
                        comment: $scope.comment.comment,
                        author: $scope.comment.author,
                        date: new Date().toISOString()
                    });
                    menuFactory.update({id: $scope.dish.id},$scope.dish);

                    $scope.comment = {
                        rating: "",
                        comment: "",
                        author: "",
                        date: ""
                    };
                    $scope.closeComment();
                };
            }
        ]
    )

    // Controlador del formulario de comentarios de un platillo
    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory){

        $scope.commentPreview = {
            rating: 5,
            comment: "",
            author: "",
            date: ""
        };

        $scope.submitComment = function () {
            $scope.dish.comments.push({
                rating: $scope.commentPreview.rating,
                comment: $scope.commentPreview.comment,
                author: $scope.commentPreview.author,
                date: new Date().toISOString()
            });

            menuFactory.update({id:$scope.dish.id},$scope.dish);

            $scope.commentPreview = {
                rating: 5,
                comment: "",
                author: "",
                date: ""
            };

            $scope.commentForm.$setPristine();
        };
    }])

    // Controlador de la pantalla index
    .controller(
        'IndexController',
        [
            '$scope',
            'leader',
            'promotion',
            'dish',
            'baseURL',
            function($scope, leader, promotion, dish, baseURL) {
                $scope.baseURL = baseURL;
                $scope.showDish = false;
                $scope.showPromotion = false;
                $scope.showLeader = false;
                $scope.dishMessage = "Loading...";
                $scope.promMessage = "Loading...";
                $scope.leadMessage = "Loading...";

                $scope.dish = dish;
                $scope.promotion = promotion;
                $scope.leader = leader;
            }
        ]
    )

    // Controlador de la pantalla About us
    .controller(
        'AboutController',
        [
            '$scope',
            'leadership',
            'baseURL',
            function($scope, leadership, baseURL) {
                $scope.baseURL = baseURL;
                $scope.showLeadership = true;
                $scope.leadMessage = "Loading...";

                $scope.leadership = leadership;
            }
        ]
    )

    .controller('FavoritesController', [
            '$scope',
            'dishes',
            'favorites',
            'favoriteFactory',
            'baseURL',
            '$ionicListDelegate',
            '$ionicPopup',
            '$ionicLoading',
            '$cordovaVibration',
            function($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $cordovaVibration) {
                $scope.baseURL = baseURL;
                $scope.shouldShowDelete = false;

                $scope.favorites = favorites;

                $scope.dishes = dishes;

                $scope.toggleDelete = function () {
                    $scope.shouldShowDelete = !$scope.shouldShowDelete;
                };

                $scope.deleteFavorite = function (index) {

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm Delete',
                        template: "Are you sure you want to delete this item?"
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                            console.log('Ok to delete');
                            favoriteFactory.deleteFromFavorites(index);
                            $cordovaVibration.vibrate(100);
                        } else {
                            console.log('Canceled delete');
                        }
                    });
                    $scope.shouldShowDelete = false;
                };
            }
        ]
    )

    .filter('favoriteFilter', function(){
        return function(dishes, favorites) {
            var out = [];

            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < dishes.length; j++) {
                    if(dishes[j].id === favorites[i].id)
                        out.push(dishes[j]);
                }
            }

            return out;
        }
    })
    ;
