findMate.filter('dateFilter', function($filter)
{
    return function (items) {
        var filtered = [];
        var todayDate = new Date();
        var todayDay = todayDate.getDate();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemDate = item.startDate;
            if (itemDate.getDate() < todayDate) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});
