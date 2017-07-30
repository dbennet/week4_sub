(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .directive("sdBusinessServicesAuthz", BusinessServicesAuthzDirective);

  BusinessServicesAuthzDirective.$inject = [];

  function BusinessServicesAuthzDirective() {
    var directive = {
        bindToController: true,
        controller: BusinessServicesAuthzController,
        controllerAs: "vm",
        restrict: "A",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
      console.log("BusinessServicesAuthzDirective", scope);
    }
  }

  BusinessServicesAuthzController.$inject = ["$scope",
                                   "spa-demo.subjects.BusinessServicesAuthz"];
  function BusinessServicesAuthzController($scope, BusinessServicesAuthz) {
    var vm = this;
    vm.authz={};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem=newItem;

    activate();
    return;
    //////////
    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
      BusinessServicesAuthz.getAuthorizedUser().then(
        function(user){ authzUserItem(item, user); },
        function(user){ authzUserItem(item, user); });
    }

    function authzUserItem(item, user) {
      console.log("new Item/Authz", item, user);

      vm.authz.authenticated = BusinessServicesAuthz.isAuthenticated();
      vm.authz.canQuery      = BusinessServicesAuthz.canQuery();
      vm.authz.canCreate = BusinessServicesAuthz.canCreate();
      if (item && item.$promise) {
        vm.authz.canUpdate     = false;
        vm.authz.canDelete     = false;
        vm.authz.canGetDetails = false;
        item.$promise.then(function(){ checkAccess(item); });
      } else {
        checkAccess(item)
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate     = BusinessServicesAuthz.canUpdate(item);
      vm.authz.canDelete     = BusinessServicesAuthz.canDelete(item);
      vm.authz.canGetDetails = BusinessServicesAuthz.canGetDetails(item);
      console.log("checkAccess", item, vm.authz);
    }    

    function canUpdateItem(item) {
      return BusinessServicesAuthz.canUpdate(item);
    }    
  }
})();