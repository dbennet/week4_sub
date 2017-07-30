(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.BusinessServiceThing", BusinessServiceThing);

  BusinessServiceThing.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function BusinessServiceThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/business_services/:business_service_id/thing_business_services");
  }

})();