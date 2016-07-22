function ConvertDate(date) {
    if (date.indexOf("-") > 0) {
        var datearray = date.split(/[-T]/);
        if (datearray.length == 4) {
            var returndate = datearray[1] + "/" + datearray[2] + "/" + datearray[0] + " " + datearray[3];
            return returndate;
        }
    }
    return "";
}


function removeMarker(vehnumber) {
    //Temp- cleanup and rebuild all arrays to check if this is the issue.
    if (lookup.hasOwnProperty(vehnumber)) {
        //google.maps.event.clearListeners(lookup[vehnumber], 'mouseover');
        //google.maps.event.clearListeners(lookup[vehnumber], 'mouseout');
        lookup[vehnumber].setVisible(false);
        lookup[vehnumber].setMap(null);
        var index = markers.indexOf(lookup[vehnumber]);
        markers[index] = null;
        if (index > -1)
            markers.splice(index, 1);

        //lookup = {};
        //for (i = 0; i < markers.length; i++)
        //{
        //    lookup[markers[i].VehiclePlate] = markers[i];
        //}


        //TODO: FIX THE LOOKUP VALUES TO THE REMAINING ITEMS IN THE ARRAY
        delete lookup[vehnumber];
    }
}



function cleanMarkers() {
    //Anything older than three minutes should be removed from the map.

    for (index = 0; index < markers.length; index++) {
        var indexdate = new Date(ConvertDate(markers[index].date));
        indexdate.setMinutes(indexdate.getMinutes() + 3);
        var cleanupdate = new Date();

        if (indexdate < cleanupdate) {
            removeMarker(markers[index].VehiclePlate);
        }
    }
}

function applyFilter() {
    for (var i = 0; i < routefilter.length; i++) {
        var j = markers.length;
        j = j - 1;
        while (j >= 0) {
            if (markers[j].Route == routefilter[i]) {
                removeMarker(markers[j].VehiclePlate);
            }
            j = j - 1;
        }
    }
}

function identifyDirection(heading) {
    var direction;
    var x = heading;

    if (x >= 0 && x < 21)
        direction = "n";
    else if (x >= 21 && x < 67)
        direction = "ne";
    else if (x >= 67 && x < 113)
        direction = "e";
    else if (x >= 113 && x < 159)
        direction = "se";
    else if (x >= 159 && x < 205)
        direction = "s";
    else if (x >= 205 && x < 251)
        direction = "sw";
    else if (x >= 251 && x < 297)
        direction = "w";
    else if (x >= 297 && x < 343)
        direction = "nw";
    else if (x >= 343 && x <= 360)
        direction = "n";
    else
        direction = "n";

    return direction;
}