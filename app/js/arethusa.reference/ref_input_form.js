"use strict";

angular.module('arethusa.reference').directive('refInputForm', [
  'reference',
  'state',
  function(reference,state) {
    return {
//      restrict: 'A',
//      scope: {},
      link: function(scope, element, attrs) {
        scope.refArr = [];
        scope.tokenMapRef = new Object();
        scope.state = state;
        scope.submit = function() {
           scope.refArr = reference.createNewRef(scope.ids,scope.currentTokenStrings,scope.ref)[0];
          scope.tokenMapRef = reference.createNewRef(scope.ids,scope.currentTokenStrings,scope.ref)[1];
        };
        scope.splitRefs = function(token) {
          return reference.splitRefs(scope.tokenMapRef, token);
        };

        function currentTokens() {
             return scope.active ? state.toTokenStrings(scope.ids) : '';
        }

        function begins_with(input_string, comparison_string) {
          return input_string.toUpperCase().indexOf(comparison_string.toUpperCase()) === 0;
        };

        function geojson_embed(pleiades_id) {
              var iframe;
              iframe = $('<iframe>');
              iframe.attr('height', 210);
              iframe.attr('width', '100%');
              iframe.attr('frameborder', 0);
              iframe.attr('src', "https://render.githubusercontent.com/view/geojson?url=https://raw.githubusercontent.com/ryanfb/pleiades-geojson/gh-pages/geojson/" + pleiades_id + ".geojson");
              return iframe;
          };

          function append_modern_country(div_id, lat, lng) {
              return $.ajax("http://api.geonames.org/countrySubdivisionJSON?lat=" + lat + "&lng=" + lng + "&username=ryanfb", {
                  type: 'GET',
                  dataType: 'json',
                  crossDomain: 'true',
                  error: function(jqXHR, textStatus, errorThrown) {
                      return console.log("AJAX Error: " + textStatus);
                  },
                  success: function(data) {
                      var modern_country;
                      if (data.countryName) {
                          modern_country = data.countryName;
                          if (data.adminName1) {
                              modern_country += " > " + data.adminName1;
                          }
                          $("#" + div_id).before($('<span>', {
                              style: 'color:gray;'
                          }).text(modern_country));
                          return $("#" + div_id).before($('<br>'));
                      }
                  }
              });
          };


          function append_description(div_id) {
              return function(data) {
                  $("#" + div_id).append($('<em>', {
                      id: "" + div_id + "_description"
                  }).text(data.description));
                  if (_.values(data.features[0])[2].location_precision === 'unlocated') {
                      $("#" + div_id).addClass('unlocated');
                  }
                  return append_modern_country("" + div_id + "_description", data.reprPoint[1], data.reprPoint[0]);
              };
          };

          window.pleiades_link = function(pleiades_id) {
              var link;
              link = $('<a>').attr('href', "http://pleiades.stoa.org/places/" + pleiades_id);
              link.attr('target', '_blank');
              link.text(pleiades_id);
              return link;
          };



        scope.$watchCollection('state.clickedTokens', function(newVal, oldVal) {
          scope.ids = Object.keys(newVal).sort();
          scope.active = scope.ids.length;
          scope.currentTokenStrings = currentTokens();
          if(currentTokens() == "") {
              return;
          }
          var name_matches = reference.getAllData().filter(function(entry) {
            return begins_with(entry[0], currentTokens());
          });
          var unique_ids = _.uniq(name_matches.map(function(match) {
                return match[1];
          }));

          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = unique_ids.length; _i < _len; _i++) {
              var unique_id = unique_ids[_i];
              _results.push([
                  (function () {
                      var _j, _len1, _results1;
                      _results1 = [];
                      for (_j = 0, _len1 = name_matches.length; _j < _len1; _j++) {
                          var name_match = name_matches[_j];
                          if (name_match[1] === unique_id) {
                              _results1.push(name_match[0]);
                          }
                      }
                      return _results1;
                  })(), unique_id
              ]);
          }

            scope.tokenRefs = new Array(_results.length);
            for(var ii = 0;ii <  _results.length;ii ++) {
                var res = _results[ii];
                scope.tokenRefs[ii] = {};
                scope.tokenRefs[ii].id = res[1];
                scope.tokenRefs[ii].name = res[0] + "";
                scope.tokenRefs[ii].placeLink="http://pleiades.stoa.org/places/"+res[1];
                scope.tokenRefs[ii].country = "";
                var dsp = "";
                    $.ajax("/pleiades-geojson/geojson/" + res[1] + ".geojson", {
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                        async: false,
                    error: function(jqXHR, textStatus, errorThrown) {
                        return console.log("AJAX Error: " + textStatus);
                    },
                    success: function(data) {
                       dsp = data.description;
                        $.ajax("http://api.geonames.org/countrySubdivisionJSON?lat=" +
                            data.reprPoint[1]  + "&lng=" + data.reprPoint[0] + "&username=ryanfb",
                            {
                            type: 'GET',
                            dataType: 'json',
                            crossDomain: 'true',
                                async: false,
                            error: function(jqXHR, textStatus, errorThrown) {
                                return console.log("AJAX Error: " + textStatus);
                            },
                            success: function(data) {
                                var modern_country;
                                if (data.countryName) {
                                    modern_country = data.countryName;
                                    if (data.adminName1) {
                                        modern_country += " > " + data.adminName1;
                                    }
                                    scope.tokenRefs[ii].country = modern_country;
                                }
                            }
                        });
                    }
                });
                scope.tokenRefs[ii].dsp = dsp;

            }

          //scope.TokenPlaces = populate_results(_results.reverse());
        });

      },
      templateUrl: 'templates/arethusa.reference/ref_input_form.html'
    };
  }

]);
//
//
//var append_description, append_modern_country, begins_with, geojson_embed, populate_results, search_for,
//    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
//
//begins_with = function(input_string, comparison_string) {
//  return input_string.toUpperCase().indexOf(comparison_string.toUpperCase()) === 0;
//};
//
//geojson_embed = function(pleiades_id) {
//  var iframe;
//  iframe = $('<iframe>');
//  iframe.attr('height', 210);
//  iframe.attr('width', '100%');
//  iframe.attr('frameborder', 0);
//  iframe.attr('src', "https://render.githubusercontent.com/view/geojson?url=https://raw.githubusercontent.com/ryanfb/pleiades-geojson/gh-pages/geojson/" + pleiades_id + ".geojson");
//  return iframe;
//};
//
//window.pleiades_link = function(pleiades_id) {
//  var link;
//  link = $('<a>').attr('href', "http://pleiades.stoa.org/places/" + pleiades_id);
//  link.attr('target', '_blank');
//  link.text(pleiades_id);
//  return link;
//};
//
//append_modern_country = function(div_id, lat, lng) {
//  return $.ajax("http://api.geonames.org/countrySubdivisionJSON?lat=" + lat + "&lng=" + lng + "&username=ryanfb", {
//    type: 'GET',
//    dataType: 'json',
//    crossDomain: 'true',
//    error: function(jqXHR, textStatus, errorThrown) {
//      return console.log("AJAX Error: " + textStatus);
//    },
//    success: function(data) {
//      var modern_country;
//      if (data.countryName) {
//        modern_country = data.countryName;
//        if (data.adminName1) {
//          modern_country += " > " + data.adminName1;
//        }
//        $("#" + div_id).before($('<span>', {
//          style: 'color:gray;'
//        }).text(modern_country));
//        return $("#" + div_id).before($('<br>'));
//      }
//    }
//  });
//};
//
//append_description = function(div_id) {
//  return function(data) {
//    $("#" + div_id).append($('<em>', {
//      id: "" + div_id + "_description"
//    }).text(data.description));
//    if (_.values(data.features[0])[2].location_precision === 'unlocated') {
//      $("#" + div_id).addClass('unlocated');
//    }
//    return append_modern_country("" + div_id + "_description", data.reprPoint[1], data.reprPoint[0]);
//  };
//};
//
//populate_results = function(results) {
//  alert(results);
//  var col, i, result, row, uid, _i, _j, _len, _ref, _ref1, _results;
//  $('#results').empty();
//  _results = [];
//  for (i = _i = 0, _ref = results.length; _i <= _ref; i = _i += 3) {
//    row = $('<div>').attr('class', 'row');
//    _ref1 = results.slice(i, i + 3);
//    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
//      result = _ref1[_j];
//      col = $('<div>').attr('class', 'col-md-4');
//      uid = _.uniqueId('results-col-');
//      col.attr('id', uid);
//      col.append($('<p>').text("" + (result[0].join(', ')) + " - ").append(window.pleiades_link(result[1])));
//      col.append(geojson_embed(result[1]));
//      $.ajax("/pleiades-geojson/geojson/" + result[1] + ".geojson", {
//        type: 'GET',
//        dataType: 'json',
//        crossDomain: true,
//        error: function(jqXHR, textStatus, errorThrown) {
//          return console.log("AJAX Error: " + textStatus);
//        },
//        success: append_description(uid)
//      });
//      row.append(col);
//    }
//    $('#results').append(row);
//    _results.push($('#results').append($('<br>')));
//  }
//  return _results;
//};
//
//search_for = function(value, index) {
//  var id_url_regex, matches, name_match, name_matches, pleiades_id, unique_id, unique_ids;
//  console.log("Searching for " + value);
//  id_url_regex = /(?:https?:\/\/)?(?:pleiades\.stoa\.org\/places\/)?(\d+)\/?/;
//
//  if (id_url_regex.test(value)) {
//    pleiades_id = value.match(id_url_regex)[1];
//    console.log(pleiades_id);
//    name_matches = index.filter(function(entry) {
//      return __indexOf.call(entry.slice(1), pleiades_id) >= 0;
//    });
//  } else {
//    name_matches = index.filter(function(entry) {
//      return begins_with(entry[0], value);
//    });
//  }
//
//  unique_ids = _.uniq(name_matches.map(function(match) {
//    return match[1];
//  }));
//  matches = (function() {
//    var _i, _len, _results;
//    _results = [];
//    for (_i = 0, _len = unique_ids.length; _i < _len; _i++) {
//      unique_id = unique_ids[_i];
//      _results.push([
//        (function() {
//          var _j, _len1, _results1;
//          _results1 = [];
//          for (_j = 0, _len1 = name_matches.length; _j < _len1; _j++) {
//            name_match = name_matches[_j];
//            if (name_match[1] === unique_id) {
//              _results1.push(name_match[0]);
//            }
//          }
//          return _results1;
//        })(), unique_id
//      ]);
//    }
//    return _results;
//  })();
//  populate_results(matches.reverse());
//  return console.log("done searching");
//};
//
