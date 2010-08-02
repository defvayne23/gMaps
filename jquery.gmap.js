/*
 * gMaps
 * http://gmaps.monkeecreate.com
 * 
 * Google Maps Interactive & Static jQuery Plugin
 * 
 * Developed by John Hoover <john@defvayne23.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 3.0.0- Last updated: May 17, 2010
*/
(function($) {
	jQuery.fn.gMap = function(options){
		var gMap;
		// Default map settings
		var options = $.extend({
			/** Interactive & Static Map **/
			map: 'interactive',
			width: 200,
			height: 200,
			center: '',
			visible: '',
			zoom: '',
			type: 'roadmap', //roadmap, satellite, hybrid, and terrain
			markers: [],
			polylines: [],
			polygons: [],
			
			/** Static Map **/
			format: 'png-32', //png-8, png-32, gif, jpg, jpg-baseline
			mobile: 'false', //STRING NOT BOOL
			sensor: 'false', //STRING NOT BOOL
			title: 'Google Maps',
			
			error: function(error){}
		}, options);
		var apiUrl = 'http://maps.google.com/maps/api/staticmap?';
		
		// Default marker settings
		var markersDefOptions = {
			/** Position **/
			address: '',
			latlng: [],
			
			/** Content **/
			label: '',
			content: '',
			icon: {},
			shadow: {}
		};
		var markersDefIcon = {
			/** Simple Icon **/
			size: 'mid', // tiny, mid, small
			color: 'red', // black, brown, green, purple, yellow, blue, gray, orange, red, white
			
			/** Complex Icon **/
			image: '',
			//size: [], // width, height
			origin: [], // x, y
			anchor: [] // x, y
		};
		
		// Default polyline settings
		var polylineDefOptions = {
			points: [],
			stroke: {}
		};
		var polylineDefStroke = {
			color: 'ff0000',
			opacity: 1,
			weight: 1
		};
		
		// Default polygon settings
		var polygonDefOptions = {
			points: [],
			stroke: {},
			fill: {}
		};
		var polygonDefStroke = {
			color: 'ff0000',
			opacity: 1,
			weight: 1
		};
		var polygonDefFill = {
			color: 'ff0000',
			opacity: 1
		};
		
		// Loop given elements
		this.each(function() {
			var self = this;
			
			// Initialize map by type
			if(options.map == 'static') {
				var url = apiUrl;
				
				// Add Settings
				url += 'size=' + options.width + 'x' + options.height;
				url += '&format=' + options.format;
				
				if(options.center != '') {
					url += '&center=' + escape(options.center);
				}
				
				if(options.visible != '') {
					url += '&zoom=' + options.zoom;
				}
				
				if(options.visible != '') {
					url += '&visible=' + escape(options.visible);
				}
				
				url += '&type=' + options.type;
				url += '&mobile=' + options.mobile;
				url += '&sensor=' + options.sensor;
			} else {
				// Set width and height of element
				$(self).width(options.width);
				$(self).height(options.height);
				
				// Initialize map
				var map = new google.maps.Map(
					self,
					{
						zoom: options.zoom,
						mapTypeId: options.type
					}
				);
				
				// Geocoder
				var geocoder = new google.maps.Geocoder();
				
				// Info Window
				var infoWindow = new google.maps.InfoWindow();
				
				// Initialize map bounds
				var bounds = new google.maps.LatLngBounds(0, 0);
				
				// Set map center
				if(options.center[0] != '') {
					// Lat & Lng given
					map.setCenter(new google.maps.LatLng(options.center[0], options.center[1]));
				} else {
					// Address given
					center = new google.maps.LatLng(0, 0);
				}
				
				// Close info windows when clicking on map
				google.maps.event.addListener(map, "click", function(event){
					infoWindow.close();
				});
			}
			
			// Add Markers
			$(options.markers).each(function(item, markerOptions) {
				var markerOptions = $.extend({}, markersDefOptions, markerOptions);
				markerOptions.icon = $.extend({}, markersDefIcon, markerOptions.icon);
				markerOptions.shadow = $.extend({}, markersDefIcon, markerOptions.shadow);
				
				if(options.map == 'static') {
					var marker = '';
					
					// Settings
					marker += 'size:' + markerOptions.icon.size;
					marker += '|color:' + markerOptions.icon.color;
				
					// Letter over marker
					if(markerOptions.label != '') {
						marker += '|label:' + markerOptions.label;
					}
					
					// Icon
					if(markerOptions.icon.image != '') {
						marker += '|icon:'+escape(markerOptions.icon.image);
					}
				
					// Location
					if(markerOptions.address != '') {
						// Address
						marker += '|' + escape(markerOptions.address);
					} else {
						// Lat/Lng
						marker += '';
					}
				
					// Add marker to url
					url += '&markers=' + marker;
				} else {
					// Initialize marker and attach to map
					var marker = new google.maps.Marker({
						map: map,
						title: markerOptions.label
					});
				
					// Set marker position
					if(markerOptions.latlng.length > 0) {
						// Lat & Lng given
						point = new google.maps.LatLng(markerOptions.latlng[0], markerOptions.latlng[1]);
						marker.setPosition(point);
						
						// Extend map bounds
						bounds.extend(point);
					} else {
						// Address given
						geocoder.geocode( { 'address': markerOptions.address}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								marker.setPosition(results[0].geometry.location);
								bounds.extend(results[0].geometry.location);
								map.fitBounds(bounds);
							} else {
								options.error(self, "Geocode was not successful for the following reason: " + status);
							}
						});
					}
					
					// Icon
					if(markerOptions.icon.image != '') {
						// Complex Icon
						marker.setIcon(
							new google.maps.MarkerImage(
								markerOptions.icon.image,
      							new google.maps.Size(markerOptions.icon.size[0], markerOptions.icon.size[1]),
      							new google.maps.Point(markerOptions.icon.origin[0], markerOptions.icon.origin[1]),
      							new google.maps.Point(markerOptions.icon.anchor[0], markerOptions.icon.anchor[1])
							)
						);
					} else {
						// Simple Icon
					}
					
					// Shadow
					if(markerOptions.shadow.image != '') {
					 	marker.setShadow(
							new google.maps.MarkerImage(
								markerOptions.shadow.image,
      							new google.maps.Size(markerOptions.shadow.size[0], markerOptions.shadow.size[1]),
      							new google.maps.Point(markerOptions.shadow.origin[0], markerOptions.shadow.origin[1]),
      							new google.maps.Point(markerOptions.shadow.anchor[0], markerOptions.shadow.anchor[1])
							)
						);
					}
					
					// Info Window
					google.maps.event.addListener(marker, "click", function() {
						infoWindow.setOptions({content: markerOptions.content});
						infoWindow.open(map, marker);
					});

				}
			});
			
			// Add Polyline
			$(options.polylines).each(function(item, polylineOptions) {
				var polylineOptions = $.extend({}, polylineDefOptions, polylineOptions);
				polylineOptions.stroke = $.extend({}, polylineDefStroke, polylineOptions.stroke);
				
				if(options.map == 'static') {
					var polyline = '';
					
					// Convert stroke opacity to hex
					strokeHex = Math.floor(polylineOptions.stroke.opacity * 255).toString(16);
					if(strokeHex.length == 1) {
						strokeHex = 0+strokeHex;
					}
					
					// Settings
					polyline += 'color:0x' + polylineOptions.stroke.color+strokeHex;
					polyline += '|weight:' + polylineOptions.stroke.weight;
					
					$(polylineOptions.points).each(function(item, point) {
						polyline += '|'+point[0]+','+point[1];
					});
				
					// Add polyline to url
					url += '&path=' + polyline;
				} else {
					// Initialize polyline points array
					var polylinePoints = new google.maps.MVCArray();
					
					// Initialize polyline and attach to map
					var polyline = new google.maps.Polyline({
						map: map,
						path: polylinePoints,
						strokeColor: '#'+polylineOptions.stroke.color,
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
			$(options.polygons).each(function(item, polygonOptions) {
				var polygonOptions = $.extend({}, polygonDefOptions, polygonOptions);
				polygonOptions.stroke = $.extend({}, polygonDefStroke, polygonOptions.stroke);
				polygonOptions.fill = $.extend({}, polygonDefFill, polygonOptions.fill);
				
				if(options.map == 'static') {
					var polygon = '';
					
					// Convert stroke opacity to hex
					strokeHex = Math.floor(polygonOptions.stroke.opacity * 255).toString(16);
					if(strokeHex.length == 1) {
						strokeHex = 0+strokeHex;
					}
					
					// Convert fill opacity to hex
					fillHex = Math.floor(polygonOptions.fill.opacity * 255).toString(16);
					if(fillHex.length == 1) {
						fillHex = 0+fillHex;
					}
					
					// Settings
					polygon += 'color:0x' + polygonOptions.stroke.color+strokeHex;
					polygon += '|weight:' + polygonOptions.stroke.weight;
					polygon += '|fillcolor:0x' + polygonOptions.fill.color+fillHex;
					
					$(polygonOptions.points).each(function(item, point) {
						polygon += '|'+point[0]+','+point[1];
						
						if(polygonOptions.points.length - 1 == item)
							polygon += '|'+polygonOptions.points[0][0]+','+polygonOptions.points[0][1];
					});
				
					// Add polygon to url
					url += '&path=' + polygon;
				} else {
					// Initialize polygon points array
					var polygonPoints = new google.maps.MVCArray();
					
					// Initialize polygon and attach to map
					var polygon = new google.maps.Polygon({
						map: map,
						path: polygonPoints,
						strokeColor: '#'+polygonOptions.stroke.color,
						strokeOpacity: polygonOptions.stroke.opacity,
						strokeWeight: polygonOptions.stroke.weight,
						fillColor: '#'+polygonOptions.fill.color,
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
			
			// Finish
			if(options.map == 'static') {
				if(url.length > 2048) {
					options.error(self, "URL for image exceeded max length of 2048 characters.");
				} else {
					// Replace html of given element with image
					$(self).html('<img src="' + url + '" width="' + options.width +'" height="' + options.height +'" alt="' + options.title +'" title="' + options.title +'" >');
				}
			} else {
				map.fitBounds(bounds);
			}
		});
		
		return this;
	};
})(jQuery);