(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.BusinessServicesAuthz", BusinessServicesAuthzFactory);

  BusinessServicesAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                "spa-demo.authz.BasePolicy"];
  function BusinessServicesAuthzFactory(Authz, BasePolicy) {
    function BusinessServicesAuthz() {
      BasePolicy.call(this, "BusinessService");
    }

      //start with base class prototype definitions
    BusinessServicesAuthz.prototype = Object.create(BasePolicy.prototype);
    BusinessServicesAuthz.constructor = BusinessServicesAuthz;

      //override and add additional methods
    BusinessServicesAuthz.prototype.canCreate=function() {
      //console.log("ItemsAuthz.canCreate");
      return Authz.isAuthenticated();
    };

    return new BusinessServicesAuthz();
  }
})();