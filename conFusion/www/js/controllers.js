angular.module('conFusion.controllers', ['ionic'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
   $scope.loginData = $localStorage.getObject('userinfo','{}');
   $scope.registration = {};

    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
     $ionicPlatform.ready(function() {
        var options = {
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
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };

        // $scope.getFileContentAsBase64 = function(path,callback)
        // {
        //     window.resolveLocalFileSystemURL(path, gotFile, fail);
              
        //     $scope.fail = function(e) {
        //       alert('Cannot find requested file');
        //     }

        //     $scope.getFile = function(fileEntry) 
        //     {
        //        fileEntry.file(function(file) 
        //        {
        //           var reader = new FileReader();
        //           reader.onloadend = function(e) 
        //           {
        //                var content = this.result;
        //                callback(content);
        //           };
        //           // The most important point, use the readAsDatURL Method from the file plugin
        //           reader.readAsDataURL(file);
        //        });
        //     }
        // }
        

        
        $scope.selPicture = function() 
        {
            var options = {
               maximumImagesCount: 1,
               width: 800,
               height: 800,
               quality: 80
            };
            console.log('inside selPicture')
          $cordovaImagePicker.getPictures(options)
            .then(function (results) {
              // for (var i = 0; i < results.length; i++) 
              // {
                console.log('Image URI: ' + results);
                //$scope.registration.imgSrc = "data:image/jpeg;base64,"+results;
                   
                // var path=results;
                // // Convert image
                // $scope.getFileContentAsBase64=function(path,function(base64Image)
                // {
                //   //window.open(base64Image);
                //   console.log(base64Image); 
                //   // Then you'll be able to handle the myimage.png file as base64
                // });

              // }
            }, function(error) {
              console.log('Error :' + error);
            });
            $scope.registerform.show();
        };
    });
  
    
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  $scope.reservation = {};
  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };    
  

})


.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', '$localStorage','baseURL', '$ionicListDelegate', '$ionicModal', '$timeout','$cordovaLocalNotification', '$cordovaToast', function($scope, dishes, favoriteFactory, $localStorage, baseURL, $ionicListDelegate, $ionicModal, $timeout, $cordovaLocalNotification, $cordovaToast) {
            
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
            $scope.dishes=dishes;

                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
             $scope.addFavorite = function(index) {
                console.log("index is vikram" + index);
                favoriteFactory.addToFavorites(index);
                console.log('Outside fav fact');
                $ionicListDelegate.closeOptionButtons();

                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.dishes[index].name
                    }).then(function () {
                        console.log('Added Favorite '+$scope.dishes[index].name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
                    });

                    $cordovaToast
                      .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                      });
                });

            };

            $scope.sample=function(index){
                console.log("sample index is"+index);
            };
            
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams','dish', 'menuFactory', 'favoriteFactory','baseURL','$ionicPopover','$ionicModal', '$timeout', '$cordovaToast', '$cordovaLocalNotification' function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $timeout, $cordovaToast, $cordovaLocalNotification) {
            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";

             $ionicPopover.fromTemplateUrl('/templates/dishdetail-popover.html', {
                        scope: $scope
                      }).then(function(popover) {
                        $scope.popover = popover;
                      });


                      $scope.openPopover = function($event) {
                        console.log("this is a popover"+$event);
                        console.log("this is the content"+$scope.popover);
                        $scope.popover.show($event);
                      };
                      $scope.closePopover = function() {
                        $scope.popover.hide();
                      };
                      //Cleanup the popover when we're done with it!
                      $scope.$on('$destroy', function() {
                        $scope.popover.remove();
                      });
                      // Execute action on hide popover
                      $scope.$on('popover.hidden', function() {
                        // Execute action
                      });
                      // Execute action on remove popover
                      $scope.$on('popover.removed', function() {
                        // Execute action
                      });
                     $scope.addFavorite = function(index) 
                     {
                        $ionicPlatform.ready(function () 
                        {

                            $cordovaLocalNotification.schedule({
                                id: 1,
                                title: "Added Favorite",
                                text: $scope.dish.name
                            }).then(function () {
                                //console.log('Added Favorite '+$scope.dishes[index].name);
                            },
                            function () {
                                //console.log('Failed to add Notification ');
                            });

                            $cordovaToast.show('Added Favorite '+$scope.dish.name, 'long', 'bottom').then(function (success) {
                                  //console.log("The toast was shown");
                              }, function (error) {
                                  //console.log("The toast was not shown due to " + error);
                            });
                        });
                        console.log("index is " + index);
                        favoriteFactory.addToFavorites(index);
                        $scope.closePopover();
                     };
                      
            
            $scope.dish = dish;
            $scope.comment_form = {};
              // Create the reserve modal that we will use later
              $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                scope: $scope
              }).then(function(modal) {
                $scope.popupcommentForm = modal;
              });

              // Triggered in the reserve modal to close it
              $scope.closeComment = function() {
                $scope.popupcommentForm.hide();
              };

              // Open the reserve modal
              $scope.comment = function() {
                console.log("comment form");
                $scope.popupcommentForm.show();
              };

              // Perform the reserve action when the user submits the reserve form
              $scope.submitComment = function() {
                console.log('Comment Added', $scope.comment_form);

                $scope.comment_form.date = new Date().toISOString();
                console.log($scope.comment_form);
                
                $scope.dish.comments.push($scope.comment_form);
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
                
                $scope.comment_form = {};

                // Simulate a reservation delay. Remove this and replace with your reservation
                // code if using a server system
                $timeout(function() {
                  $scope.closeComment();
                }, 1000);
              };    

            
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope', 'leader' ,'dish','promotion', 'baseURL', function($scope, leader, dish, promotion, baseURL) {
                                        
                        $scope.baseURL=baseURL;
                        $scope.leader = leader;
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = dish;
                        $scope.promotion = promotion;
            
                    }])

        .controller('AboutController', ['$scope', 'leader' ,'corporateFactory', 'baseURL', function($scope, leader, corporateFactory, baseURL) {
            
                    $scope.baseURL = baseURL;
                    $scope.leaders = leader;
                    console.log($scope.leaders);
            
                    }])
        .controller('FavoritesController',  ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$ionicPlatform', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $ionicPlatform, $cordovaVibration)
                   { 
                     $scope.baseURL = baseURL;
                      $scope.shouldShowDelete = false;

                      $scope.favorites = favorites;

                      $scope.dishes = dishes;
                      
                      console.log($scope.dishes, $scope.favorites);

                      $scope.toggleDelete = function () {
                          $scope.shouldShowDelete = !$scope.shouldShowDelete;
                          console.log($scope.shouldShowDelete);
                      }

                      $scope.deleteFavorite = function (index) {

                          var confirmPopup = $ionicPopup.confirm({
                              title: 'Confirm',
                              template: 'Remove from favorites?'
                          });

                          confirmPopup.then(function (res) {
                              if (res) {
                                  console.log('Ok to delete');
                                  favoriteFactory.deleteFromFavorites(index);
                                  $ionicPlatform.ready(function () {
                                      $cordovaVibration.vibrate(1000);
                                  });
                              } else {
                                  console.log('Canceled delete');
                              }
                          });

                          $scope.shouldShowDelete = false;

                      }
                }])
        
        .filter('favoriteFilter', function () {
                    return function (dishes, favorites) 
                    {
                        var out = [];
                        for (var i = 0; i < favorites.length; i++) 
                        {
                            for (var j = 0; j < dishes.length; j++) 
                            {
                                if (dishes[j].id === favorites[i].id)
                                    out.push(dishes[j]);
                            }
                        }
                        return out;

                    }})



;
