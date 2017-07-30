(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.BusinessServiceLinkableThing", BusinessServiceLinkableThing);

  BusinessServiceLinkableThing.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function BusinessServiceLinkableThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/business_services/:business_service_id/linkable_things");
  }

})();