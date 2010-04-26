/**
* jQuery Google Maps v3 and static image plugin
* @author John Hoover <john@defvayne23.com>
*
*/
(function($) {
	jQuery.fn.gMap = function(options){
		var gMap;
		// Default map settings
		var options = $.extend({
			type: 'interactive',
			
			// Both
			width: 200,
			height: 200,
			center: '',
			visible: '',
			zoom: 1,
			type: 'roadmap', //roadmap, satellite, hybrid, and terrain
			markers: [],
			polylines: [],
			
			// Interactive
			polygons: [],
			
			// Static
			format: 'png-32', //png-8, png-32, gif, jpg, jpg-baseline
			mobile: 'false', //STRING NOT BOOL
			sensor: 'false', //STRING NOT BOOL
			title: 'Google Maps',
			apiUrl: 'http://maps.google.com/maps/api/staticmap?'
		}, options);
		// Default marker settings
		var markers = {
			size: 'mid',
			color: 'red',
			label: '',
			address: '',
			lat: '',
			lng: '',
			extendBounds: ''
		};
		// Default polyline settings
		var polylines = {
			size: 'mid',
			color: 'red',
			label: '',
			address: '',
			points: {},
		};
		
		this.each(function() {
			var self = this;
			// Attach function functions to element for latter adding
			$.extend(self, {
				addMarker: function(options) {
					
			
					return this;
				},
				addPolygon: function() {
					$(this).each(function() {
						if(options.type == 'static') {
						
						} else {
							var map = $(this).data('map');
						
							// Marker code
						
							$(this).data('map', map);
						}
					});
				
					return this;
				},
				addPolyline: function() {
					var polylineOptions = $.extend(polylines, elem);
			
					$(this).each(function() {
						if(options.type == 'static') {
							var polyline = '';
					
							// Settings
							polyline += '';
					
							// Loop points
					
					
							// Add polyline to url
							url += '&polylines=' + polyline;
						} else {
							var map = $(this).data('map');
					
							// Marker code
					
							$(this).data('map', map);
						}
					});
			
					return this;
				}
			});
			
			if(options.type == 'static') {
				var url = options.apiUrl;
				
				// Add Settings
				url += 'size=' + options.width + 'x' + options.height;
				url += '&format=' + options.format;
				
				if(options.center != '')
					url += '&center=' + escape(options.center);
				
				if(options.visible != '')
					url += '&visible=' + escape(options.visible);
				
				url += '&zoom=' + options.zoom;
				url += '&type=' + options.type;
				url += '&mobile=' + options.mobile;
				url += '&sensor=' + options.sensor;
				
				// Append image element at end of given element
				$(self).html('<img src="' + url + '" width="' + options.width +'" height="' + options.height +'" alt="' + options.title +'" title="' + options.title +'" >');
			} else {
				$(self).width(options.width);
				$(self).height(options.height);
				
				var map = new google.maps.Map(
					self,
					{
						zoom: options.zoom,
						mapTypeId: options.type
					}
				);
				var bounds = new google.maps.LatLngBounds(0, 0);
				
				// Check center type
				if(latlng = options.center.match(/([0-9.-]+), ([0-9.-]+)/i)) {
					// Lat & Lng given
					map.setCenter(new google.maps.LatLng(latlng[1], latlng[2]));
				} else {
					// Address given
					center = new google.maps.LatLng(0, 0);
					new google.maps.Geocoder().geocode({
							address: options.center
						},
						function(results, status) {
							if (status == google.maps.GeocoderStatus.OK && results.length) {
								if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
									map.setCenter(results[0].geometry.location);
		        				}
							} else {
								alert("Geocode was unsuccessful due to: " + status);
							}
						}
					);
				}
			}
			
			// Add Markers
			$(options.markers).each(function(item, markerOptions) {
				var markerOptions = $.extend(markers, markerOptions);
				
				if(options.type == 'static') {
					var image = $(self).find('img');
					var url = image.attr('src');
					var marker = '';
					
					// Settings
					marker += 'size:' + markerOptions.size;
					marker += '|color:' + markerOptions.color;
				
					// Mouse over text
					if(markerOptions.label != '')
						marker += '|label:' + markerOptions.label;
				
					// Marker Location
					if(markerOptions.address != '')
						// Address
						marker += '|' + escape(markerOptions.address);
					else
						// Lat/Lng
						marker += '';
				
					// Add marker to url
					url += '&markers=' + marker;
					
					image.attr('src', url);
				} else {
					var marker = marker = new google.maps.Marker({
						map: map
					});
				
					// Set marker position
					if(options.lat != '' && options.lng != '') {
						// Lat & Lng given
						marker.setPosition(new google.maps.LatLng(options.lat, options.lng));
					} else {
						// Address given
						location = new google.maps.LatLng(0, 0);
						new google.maps.Geocoder().geocode(
							{
								address: address
							},
							function(results, status) {
								if (status == google.maps.GeocoderStatus.OK && results.length) {
									if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
										this.marker.marker.setPosition(results[0].geometry.location);
						        	}
								} else {
									alert("Geocode was unsuccessful due to: " + status);
								}
							}
						);
					}
				
					//marker.setPosition(point);
				}
			});
			
			// Add polylines
			$(options.polylines).each(function(item, options) {
				self.addPolyline(options);
			});
			
			// Return given element
		});
		
		return this;
	};
})(jQuery);