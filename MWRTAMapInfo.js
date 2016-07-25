var iconarray;

function CreateInfoBoxContent(item) {
    var content = '<div class="businfo">' +
              '<h4 id="firstHeading" class="firstHeading"> ' +
              item.VehiclePlate +
              '</h4>' +
              '<div id="bodyContent">' +
              '<p>  Route Number: ' +
              item.Route +
              '<br> DateTime: ' +
              item.DateTime +
              '<br> Speed: ' +
              item.Speed + ' MPH'+

              '</p>' +
              '</div>' +
              '</div>';

    return content;


}

function mobileClick(link) {
    var chkboxarr = $(":checkbox[value='" + link.title + "']");

    if (chkboxarr[0].checked)
    {
        chkboxarr[0].checked = false;
        $(link).addClass('disabled');
    }
    else
    {
        chkboxarr[0].checked = true;
        $(link).removeClass('disabled');
    }
    checkboxChecked(chkboxarr);
}

function setupIconArray() {
    var AvailableRoutes = new Array("RT01", "RT02", "RT03", "RT04S", "RT04N", "RT05", "RT06", "RT07", "RT07C", "RT08", "RT09", "RT10", "RT11");
    var AvailableDirection = new Array("n", "ne", "e", "se", "s", "sw", "w", "nw");
    iconarray = new Array();
    for (var i = 0; i < AvailableRoutes.length; i++) {
        for (var j = 0; j < AvailableDirection.length; j++)
        {
            var iconname = AvailableRoutes[i] + AvailableDirection[j];
            iconarray[iconname] = new google.maps.MarkerImage('http://vc.mwrta.com/Styles/images/busicon/' + iconname + '.png', new google.maps.Size(50,50));

        }
    }

}

function identifyIcon(heading, route)
{
    var icon;
    var direction = identifyDirection(heading);
    return iconarray[route + direction];
}

function moveMarker() {
    var uri = '/mwrta';
    var vehadded = "";

    $.getJSON(uri)
    .done(function (data) {
        var icon;
        if ($(window).width < 1200)
        {
            icon = new google.maps.MarkerImage('http://vc.mwrta.com/Styles/images/busicon7.png', new google.maps.Size(50, 50));
        }
        else
        {
            icon = new google.maps.MarkerImage('http://vc.mwrta.com/Styles/images/busiconsm.png', new google.maps.Size(30, 30));
        }
            
        var FIVE_MINUTES = 5 * 60 * 1000;
        var numberofmarkers = 0;
        var lastmarkerlocation;
        $.each(data, function (key, item) {
            if (item) {
                //if the item is in the routefilter, do not display.
                if (routefilter.indexOf(item.Route) == -1) {
                    var currentTimestamp = new Date().getTime();
                    var timestamp = item.DateTimestamp + FIVE_MINUTES;

                    if (currentTimestamp < timestamp)
                    {
                        if (item.Route != null)
                        {
                            var location = 'http://vc.mwrta.com/Styles/images/busicon/' + item.Route + '.png';
                            var icon = new google.maps.MarkerImage(location, new google.maps.Size(50, 50));
                        }

                        var latlng = new google.maps.LatLng(item.Lat, item.Long);

                        if (lookup.hasOwnProperty(item.VehiclePlate)) {
                            lookup[item.VehiclePlate].setPosition(latlng);
                            lookup[item.VehiclePlate].setIcon(identifyIcon(item.Heading, item.Route));
                            numberofmarkers = numberofmarkers + 1;
                            lastmarkerlocation = latlng;
                        }
                        else {
                            var routenumber = item.Route;
                            //create a new marker and add to arrays.
                            //var marker1 = new google.maps.Marker({
                            var marker1 = new MarkerWithLabel({
                                map: map,
                                dragabble: false,
                                position: latlng,
                                labelContent: "Veh: " + item.VehiclePlate +  routenumber.replace("RT"," Route "),
                                labelAnchor: new google.maps.Point(-3, -5),
                                labelClass: "mapIconLabel",
                                labelInBackground: false,
                                icon: icon
                            });
                            marker1.setMap(map);
                            marker1.date = item.DateTime;
                            marker1.timestamp = item.DateTimestamp;
                            marker1.VehiclePlate = item.VehiclePlate;
                            marker1.Route = item.Route;
                            vehadded = vehadded + " " + item.VehiclePlate;
                            numberofmarkers = numberofmarkers + 1;
                            markers.push(marker1);
                            lookup[item.VehiclePlate] = markers[markers.length - 1];
                        }
                    }
                    else if (lookup.hasOwnProperty(item.VehiclePlate)) {
                        removeMarker(item.VehiclePlate);
                    }

                }
                else {
                    //
                }
            }
        });

        cleanMarkers();

        if (numberofmarkers == 1)
        {
            map.setCenter(lastmarkerlocation);
        }
        if (numberofmarkers == 0) {
            if (!$("#nodatadialog").dialog("isOpen")) {
                $("#nodatadialog").dialog("open");
            }
        }
        else
        {
            if ($("#nodatadialog").dialog("isOpen")) {
                $("#nodatadialog").dialog("close");
            }
        }
    });

}



function checkboxChecked(chkbox)
{
    var route = chkbox[0].value;
    //adding to the route filter removes the vehicle from the display.
    if (chkbox.is(":checked"))
    {
       
        var i = routefilter.indexOf(route);
        if (i != -1)
            routefilter.splice(i, 1);
        moveMarker();
    }
    else
    {
        routefilter.push(route);
        applyFilter();
    }

    window.localStorage && window.localStorage.setItem("routefilter", JSON.stringify(routefilter));
}



function toggleAll(chkbox)
{
    var checkall = chkbox.is(":checked");
    $(":checkbox[name='routeselectorcb']").each(
        function()
        {
            this.checked = checkall;
            //This method will not trigger an update of the filter array, so need to update here.
            
            // If checked remove from filter if exists. 
            // If unchecked, add to filter if doesnt exist.                
            var index = routefilter.indexOf(this.value);
            if (checkall)
            {
                if (index > -1)
                {
                    routefilter.splice(index, 1);
                }
            }
            else
            {
                if (index == -1)
                {
                    routefilter.push(this.value);
                }
            }
        });
    if (!checkall)
    {
        applyFilter();
    }
    else
    {
        moveMarker();
    }

    window.localStorage && window.localStorage.setItem("routefilter", JSON.stringify(routefilter));
}


function toggleTraffic(chkbox)
{
    var checked = chkbox.is(":checked");

    if (checked)
    {
        trafficLayer.setMap(map);

    }
    else
    {
        trafficLayer.setMap(null);
    }
}

function toggleMenu() {
    var menu = document.getElementById("menuItems");
    
    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

(function ($) {
    $.fn.collapsable = function (options) {
        // iterate and reformat each matched element
        return this.each(function () {
            // cache this:
            var obj = $(this);
            var tree = obj.next('.navigation');
            obj.click(function () {
                if (obj.is(':visible')) { tree.toggle(); }
            });
            $(window).resize(function () {
                if ($(window).width() <= 570) { tree.attr('style', ''); };
            });
        });
    };
})(jQuery);






