 findMate.service('editService', function($rootScope) {

 	var getId, meetingId, user;

    getId = function(meetingId, user){
        this.meetingId = meetingId;
        this.user = user;
        $rootScope.$broadcast("valuesUpdated");
    }      

 		return {
		    meetingId: meetingId,
		    user: user,
 			getId: getId
 		}

});