/*!
* gMaps
* http://gmaps.monkeecreate.com
*
* Interactive & Static Google Maps jQuery Plugin
*
* Developed by John Hoover <http://defvayne23.com>
* Another project from monkeeCreate <http://monkeecreate.com>
*
* Version 3.1.0- Last updated: April 17, 2014
*/
(function($) {
  jQuery.fn.gMap = function(opts) {
    var self, gMap, map, geocode, infowindow, bounds;
    var url = 'http://maps.google.com/maps/api/staticmap?';

    // Base for geocoding
    var geocoding = function(address, result) {
      geocoder.geocode( {'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          result(results);
        } else if (status === google.maps.GeocoderStatus.ERROR) {
          options.error(self, "There was a problem contacting the Google servers.");
        } else if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
          options.error(self, "This GeocoderRequest was invalid.");
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          options.error(self, "The webpage has gone over the requests limit in too short a period of time.");
        } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
          options.error(self, "The webpage is not allowed to use the geocoder.");
        } else if (status === google.maps.GeocoderStatus.UNKNOWN_ERROR) {
          options.error(self, "A geocoding request could not be processed due to a server error. The request may succeed if you try again.");
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          options.error(self, "No results were found for given address.");
        }
      });
    };

    // Default map settings
    var options = $.extend(true, {
      // Interactive & Static Map
      // Options
      map: 'interactive',
      center: '',
      visible: [],
      zoom: 1,
      scroll: true,
      type: 'roadmap', //roadmap, satellite, hybrid, and terrain
      style: {
        width: 'auto',
        height: 'auto',
        cursor: ''
      },

      // Elements
      markers: [],
      polylines: [],
      polygons: [],
      circles: [],
      overlay: [],

      // Methods
      click: function() {},
      error: function(error) {},

      // Interactive Map
      bounds: false,
      streetview: true,

      // Static Map
      format: null, //png (default), png32, gif, jpg, jpg-baseline
      mobile: 'false', //STRING NOT BOOL
      sensor: 'false', //STRING NOT BOOL
      title: 'Google Maps',
      scale: null // Scales image for higher respolution displays. (ex. 1,2,4)
    }, opts);

    // Default marker settings
    var markersDefOptions = {
      position: '',

      // Content
      label: '',
      content: '',
      icon: {
        type: 'simple',

        // Simple Icon
        size: 'mid', // tiny, mid, small
        color: 'red', // black, brown, green, purple, yellow, blue, gray, orange, red, white

        // Complex Icon
        image: '',
        //size: [], // width, height
        origin: [], // x, y
        anchor: [] // x, y
      },
      shadow: {
        type: 'simple',

        // Simple Icon
        size: 'mid', // tiny, mid, small
        color: 'red', // black, brown, green, purple, yellow, blue, gray, orange, red, white

        // Complex Icon
        image: '',
        //size: [], // width, height
        origin: [], // x, y
        anchor: [] // x, y
      },
      draggable: false,
      dragend: function() {}
    };

    // Default polyline settings
    var polylineDefOptions = {
      points: [],
      stroke: {
        color: 'ff0000',
        opacity: 1,
        weight: 1
      }
    };

    // Default polygon settings
    var polygonDefOptions = {
      points: [],
      stroke: {
        color: 'ff0000',
        opacity: 1,
        weight: 1
      },
      fill: {
        color: 'ff0000',
        opacity: 1
      }
    };

    // Default circle settings
    var circleDefOptions = {
      center: [],
      radius: 1, // In meters
      stroke: {
        color: 'ff0000',
        opacity: 1,
        weight: 1
      },
      fill: {
        color: 'ff0000',
        opacity: 1
      }
    };

    // Default overlay settings
    var overlayDefOptions = {
      overlay: '',
      position: [],
      opacity: 1
    };

    // Loop given elements
    this.each(function() {
      self = this;

      // Set width and height of element
      if(options.style.width === 'auto') {
        options.style.width = $(self).width();
      } else {
        $(self).width(options.style.width);
      }

      if(options.style.height === 'auto') {
        options.style.height = $(self).height();
      } else {
        $(self).height(options.style.height);
      }

      // Initialize map by type
      if(options.map === 'static') {
        // Add Settings
        url += 'size=' + options.style.width + 'x' + options.style.height;

        if(options.format !== null) {
          url += '&format=' + options.format;
        }

        if(options.scale !== null) {
          url += '&scale=' + options.scale;
        }

        if(options.center !== '') {
          url += '&center=' + escape(options.center);
        }

        if(options.zoom !== '') {
          url += '&zoom=' + options.zoom;
        }

        urlVisible = [];
        $(options.visible).each(function(index, location) {
          if(location instanceof Array)
            urlVisible.push(location[0] + ',' + location[1]);
          else
            urlVisible.push(escape(location.address));
        });

        if(urlVisible.length > 0)
          url += '&visible=' + urlVisible.join('|');

        url += '&type=' + options.type;
        url += '&mobile=' + options.mobile;
        url += '&sensor=' + options.sensor;
      } else {
        map_options = {
          mapTypeId: options.type,
          streetViewControl: options.streetview,
          scrollwheel: options.scroll
        };
        // TODO: backgroundColor
        // TODO: disableDefaultUI
        // TODO: disableDoubleClickZoom
        // TODO: draggingCursor
        // TODO: heading
        // TODO: keyboardShortcuts
        // TODO: mapTypeControl
        // TODO: mapTypeControlOptions
        // TODO: maxZoom
        // TODO: minZoom
        // TODO: noClear
        // TODO: overviewMapControl
        // TODO: panControl
        // TODO: rotateControl
        // TODO: scaleControl
        // TODO: scrollwheel
        // TODO: streetView
        // TODO: tilt
        // TODO: zoomControl

        if(options.style.cursor !== '') {
          map.setOptions({
            draggableCursor: options.style.cursor
          });
        }

        // Initialize map
        map = new google.maps.Map(
          self,
          map_options
        );

        // Geocoder
        geocoder = new google.maps.Geocoder();

        // Info Window
        infoWindow = new google.maps.InfoWindow();

        // Initialize map bounds
        bounds = new google.maps.LatLngBounds(0, 0);

        if(options.zoom !== '') {
          map.setZoom(options.zoom);
        }

        // Set map center
        if(options.center instanceof Array) {
          // Lat & Lng given
          map.setCenter(new google.maps.LatLng(options.center[0], options.center[1]));
        } else if(options.center !== '') {
          // Address given
          geocoding(options.center, function(results) {
            map.setCenter(results[0].geometry.location);
            bounds.extend(results[0].geometry.location);

            if(options.bounds === true) {
              map.fitBounds(bounds);
            }
          });
        }

        // Visible
        // $(options.visible).each(function(item, location) {
        //   if(location instanceof Array) {
        //     point = new google.maps.LatLng(location[0], location[1]);
        //     bounds.extend(point);
        //   } else {
        //     geocoding(location, function(results) {
        //       bounds.extend(results[0].geometry.location);
        //
        //       if(options.bounds === true) {
        //         map.fitBounds(bounds);
        //       }
        //     });
        //   }
        // });

        google.maps.event.addListener(map, "click", options.click);

        // Close info windows when clicking on map
        google.maps.event.addListener(map, "click", function(event) {
          infoWindow.close();
        });
      }

      // Add Markers
      $(options.markers).each(function(item, markerOpts) {
        var markerOptions = $.extend(true, {}, markersDefOptions, markerOpts);
        var marker = '';

        if(options.map === 'static') {
          // Settings
          marker += 'size:' + markerOptions.icon.size;
          marker += '|color:' + markerOptions.icon.color;

          // Letter over marker
          if(markerOptions.label !== '') {
            marker += '|label:' + markerOptions.label;
          }

          // Icon
          if(markerOptions.icon.image !== '') {
            marker += '|icon:' + escape(markerOptions.icon.image);
          }

          // Location
          if(markerOptions.position instanceof Array) {
            // Lat/Lng
            marker += '|'+markerOptions.position[0] + "," + markerOptions.position[1];
          } else {
            // Address
            marker += '|'+escape(markerOptions.position);
          }

          // Add marker to url
          url += '&markers=' + marker;
        } else {
          // TODO: animation
          // TODO: cursor
          // TODO: flat
          // TODO: raiseOnDrag
          // TODO: zIndex

          // Initialize marker and attach to map
          marker = new google.maps.Marker({
            map: map,
            title: markerOptions.label
          });

          // Set marker position
          if(markerOptions.position instanceof Array) {
            // Lat & Lng given
            point = new google.maps.LatLng(markerOptions.position[0], markerOptions.position[1]);
            marker.setPosition(point);

            // Extend map bounds
            bounds.extend(point);
          } else {
            // Address given
            geocoding(markerOptions.position, function(results) {
              marker.setPosition(results[0].geometry.location);
              bounds.extend(results[0].geometry.location);

              if(options.bounds === true) {
                map.fitBounds(bounds);
              }
            });
          }

          // Icon
          if(markerOptions.icon.image !== '') {
            // Complex Icon
            if(markerOptions.icon.type === 'complex') {
              marker.setIcon(
                new google.maps.MarkerImage(
                  markerOptions.icon.image,
                  new google.maps.Size(markerOptions.icon.size[0], markerOptions.icon.size[1]),
                  new google.maps.Point(markerOptions.icon.origin[0], markerOptions.icon.origin[1]),
                  new google.maps.Point(markerOptions.icon.anchor[0], markerOptions.icon.anchor[1])
                )
              );
            } else {
              marker.setIcon(markerOptions.icon.image);
            }
          } else {
            // TODO: Icons don't look anything like what's in the static map
            // Simple Icon
            // icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=A|";
            //
            // switch(markerOptions.icon.size) {
            //   case "tiny": icon += "1|0"; size = [15,25]; origin = [0,0]; anchor = [0,0]; break;
            //   case "mid": size = [21,34]; origin = [0,0]; anchor = [0,0]; break;
            //   case "small": size = [10,17]; origin = [0,0]; anchor = [0,0]; break;
            //   default: size = [21,34]; origin = [0,0]; anchor = [0,0];
            // }
            //
            // switch(markerOptions.icon.color) {
            //   case "black": icon += "525252"; break;
            //   case "brown": icon += "000000"; break;
            //   case "green": icon += "64b949"; break;
            //   case "purple": icon += "000000"; break;
            //   case "yellow": icon += "000000"; break;
            //   case "blue": icon += "3689cc"; break;
            //   case "gray": icon += "000000"; break;
            //   case "orange": icon += "000000"; break;
            //   case "red": icon += "ff776b"; break;
            //   case "white": icon += "ffffff"; break;
            //   default: icon += "ff776b";
            // }
            //
            // icon += "|000000";
            //
            // marker.setIcon(
            //   new google.maps.MarkerImage(
            //     icon,
            //     new google.maps.Size(size[0], size[1]),
            //     new google.maps.Point(origin[0], origin[1]),
            //     new google.maps.Point(anchor[0], anchor[1])
            //   )
            // );
          }

          // Shadow
          if(markerOptions.shadow.image !== '') {
            marker.setShadow(
              new google.maps.MarkerImage(
                markerOptions.shadow.image,
                new google.maps.Size(markerOptions.shadow.size[0], markerOptions.shadow.size[1]),
                new google.maps.Point(markerOptions.shadow.origin[0], markerOptions.shadow.origin[1]),
                new google.maps.Point(markerOptions.shadow.anchor[0], markerOptions.shadow.anchor[1])
              )
            );
          }

          // Event click
          if(markerOptions.click !== undefined) {
            google.maps.event.addListener(marker, "click", markerOptions.click);
          }

          // Event drag
          if(markerOptions.draggable === true) {
            marker.setDraggable(true);
            google.maps.event.addListener(marker, "dragend", markerOptions.dragend);
          }

          // Info Window
          google.maps.event.addListener(marker, "click", function() {
            infoWindow.close();

            infoWindow.setOptions({content: markerOptions.content});

            if(markerOptions.content !== '')
              infoWindow.open(map, marker);
          });

        }
      });

      // Add Polyline
      $(options.polylines).each(function(item, polylineOpts) {
        var polylineOptions = $.extend(true, {}, polylineDefOptions, polylineOpts);
        var polyline = '';

        if(options.map === 'static') {
          // Convert stroke opacity to hex
          strokeHex = Math.floor(polylineOptions.stroke.opacity * 255).toString(16);
          if(strokeHex.length === 1) {
            strokeHex = 0+strokeHex;
          }

          // Settings
          polyline += 'color:0x' + polylineOptions.stroke.color+strokeHex;
          polyline += '|weight:' + polylineOptions.stroke.weight;

          var polyline_points = new google.maps.MVCArray();
          $(polylineOptions.points).each(function(item, point) {
            polyline_points.push( new google.maps.LatLng(point[0], point[1]) );
          });
          polyline += '|enc:' + google.maps.geometry.encoding.encodePath( polyline_points );

          // Add polyline to url
          url += '&path=' + polyline;
        } else {
          // TODO: geodesic
          // TODO: icons
          // TODO: zIndex

          // Initialize polyline points array
          var polylinePoints = new google.maps.MVCArray();

          // Initialize polyline and attach to map
          polyline = new google.maps.Polyline({
            map: map,
            path: polylinePoints,
            strokeColor: '#' + polylineOptions.stroke.color,
            strokeOpacity: polylineOptions.stroke.opacity,
            strokeWeight: polylineOptions.stroke.weight
          });

          $(polylineOptions.points).each(function(item, point) {
            // Get current polyline path
            path = polyline.getPath();

            // Add new point to polyline
            point = new google.maps.LatLng(point[0], point[1]);
            path.insertAt(polylinePoints, point);

            // Extend map bounds
            bounds.extend(point);
          });
        }
      });

      // Add Polygon
      $(options.polygons).each(function(item, polygonOpts) {
        var polygonOptions = $.extend(true, {}, polygonDefOptions, polygonOpts);
        var polygon = '';

        if(options.map === 'static') {
          // Convert stroke opacity to hex
          strokeHex = Math.floor(polygonOptions.stroke.opacity * 255).toString(16);
          if(strokeHex.length === 1) {
            strokeHex = 0+strokeHex;
          }

          // Convert fill opacity to hex
          fillHex = Math.floor(polygonOptions.fill.opacity * 255).toString(16);
          if(fillHex.length === 1) {
            fillHex = 0+fillHex;
          }

          // Settings
          polygon += 'color:0x' + polygonOptions.stroke.color+strokeHex;
          polygon += '|weight:' + polygonOptions.stroke.weight;
          polygon += '|fillcolor:0x' + polygonOptions.fill.color+fillHex;

          var polygon_points = new google.maps.MVCArray();
          $(polygonOptions.points).each(function(item, point) {
            polygon_points.push( new google.maps.LatLng(point[0], point[1]) );

            // End the polygon with the beginning point to close it.
            if(polygonOptions.points.length - 1 === item)
              polygon_points.push( new google.maps.LatLng(polygonOptions.points[0][0], polygonOptions.points[0][1]) );
          });
          polygon += '|enc:' + google.maps.geometry.encoding.encodePath( polygon_points );

          // Add polygon to url
          url += '&path=' + polygon;
        } else {
          // TODO: geodesic
          // TODO: strokePosition
          // TODO: zIndex

          // Initialize polygon points array
          var polygonPoints = new google.maps.MVCArray();

          // Initialize polygon and attach to map
          polygon = new google.maps.Polygon({
            map: map,
            path: polygonPoints,
            strokeColor: '#' + polygonOptions.stroke.color,
            strokeOpacity: polygonOptions.stroke.opacity,
            strokeWeight: polygonOptions.stroke.weight,
            fillColor: '#' + polygonOptions.fill.color,
            fillOpacity: polygonOptions.fill.opacity
          });

          $(polygonOptions.points).each(function(item, point) {
            // Get current polygon path
            path = polygon.getPath();

            // Add new point to polygon
            point = new google.maps.LatLng(point[0], point[1]);
            path.insertAt(polygonPoints, point);

            // Extend map bounds
            bounds.extend(point);
          });
        }
      });

      // TODO: Rectangle

      // Add Circle
      $(options.circles.reverse()).each(function(item, circleOpts) {
        var circleOptions = $.extend(true, {}, circleDefOptions, circleOpts);
        var circle = '';

        if(options.map === 'static') {
          // TODO: Calculate a path to create a circle. Use encoded polylines.
          // https://stackoverflow.com/questions/7316963/drawing-a-circle-google-static-maps
          // Do nothing
        } else {
          // TODO: strokePosition
          // TODO: zIndex

          circle = new google.maps.Circle({
            map: map,
            center: new google.maps.LatLng(circleOptions.center[0], circleOptions.center[1]),
            radius: circleOptions.radius,
            strokeColor: '#' + circleOptions.stroke.color,
            strokeOpacity: circleOptions.stroke.opacity,
            strokeWeight: circleOptions.stroke.weight,
            fillColor: '#' + circleOptions.fill.color,
            fillOpacity: circleOptions.fill.opacity
          });

          bounds.union(circle.getBounds());
        }
      });

      // TODO: overlay
      // GroundOverlay
      // circle_bounds = circle.getBounds();
      // new google.maps.GroundOverlay(
      //   options.overlay,
      //   new google.maps.LatLngBounds(
      //     circle_bounds.getSouthWest(),
      //     circle_bounds.getNorthEast()
      //   ),
      //   { map: map }
      // );

      // Finish
      if(options.map === 'static') {
        if(url.length > 2048) {
          options.error(self, "URL for image exceeded max length of 2048 characters.");
        } else {
          // Replace html of given element with image.
          $(self).html('<img src="' + url + '" width="' + options.style.width + '" height="' + options.style.height + '" alt="' + options.title + '">');
        }
      } else {
        if(options.bounds === true) {
          map.fitBounds(bounds);
        }

        // TODO: Check what options have been bassed. If not enough info, could not show map.
      }
    });

    return this;
  };
})(jQuery);
