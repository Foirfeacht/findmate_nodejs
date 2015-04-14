// map controller
// public/map.js

findMate.controller('adminController', ['$scope', '$http', '$routeParams', '$mdSidenav', function($scope, $http, $routeParams, $mdSidenav) {

    
    // when landing on the page, get all events and show them
    $http.get('../api/meetings')
        .success(function(data) {
            $scope.meetings = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $http.get('../api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });


    $scope.singleMeeting = function(id) {
        $http.get('../api/meetings' + id)
            .success(function(data) {
                $scope.meetings = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

    $scope.deleteMeeting = function(id) {
        console.log(id);
        $http.delete('../api/meetings/' + id)
            .success(function (data) {
                $scope.meetings = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteUser = function(id) {
        console.log(id);
        $http.delete('../api/users/' + id)
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };    

    $scope.selectedUser = null;

    $scope.onUserSelect = function(selectedUser){
        if(selectedUser){
            $scope.selectedUser = selectedUser;
            console.log($scope.selectedUser);
        } else {
            $scope.selectedUser = null;
            console.log($scope.selectedUser);
        }
    }
// not implemented yet

    $scope.getFriends = function (user) {

        var friendsRequest = 'https://graph.facebook.com/' + user.facebook.id + '/friends' + '?access_token=' + user.facebook.token;
        $http.get(friendsRequest)
            .success(function(data) {
                $scope.friends = data.data;
                $scope.frList = {};
                console.log(data.data);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }


    // sorting
    //$scope.predicate


    //table
    /*$scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: meetings.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                                $filter('orderBy')(meetings, params.orderBy()) :
                                meetings;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
*/
    // side nav
    $scope.toggleNav = function() {
       $mdSidenav('nav').toggle();
    };
}]);