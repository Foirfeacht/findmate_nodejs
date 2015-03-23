findMate.filter('loggedInUserFilter', function(){
    return function(objects, logged_in_user){
        var filterResult = new Array();
        if(!logged_in_user)
            return objects;
       
        for(index in objects) {
            if(objects[index].participants.indexOf(logged_in_user) != -1) // filter by name only
                filterResult.push(objects[index]);
        }
        console.log(filterResult);
        return filterResult;  
    }    
});