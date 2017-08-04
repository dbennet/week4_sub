(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ThingService", ThingService);

  ThingService.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function ThingService($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/thing_services/:id",
      { thing_id: '@thing_id', 
        id: '@id'},
      { update: {method:"PUT"} 
      });
  }

})();