(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdBusinessServiceSelector", {
      templateUrl: business_serviceSelectorTemplateUrl,
      controller: BusinessServiceSelectorController,
      bindings: {
        authz: "<"
      },
    })
    .component("sdBusinessServiceEditor", {
      templateUrl: business_serviceEditorTemplateUrl,
      controller: BusinessServiceEditorController,
      bindings: {
        authz: "<"
      },
      require: {
        business_servicesAuthz: "^sdBusinessServicesAuthz"
      }
    });


  business_serviceSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function business_serviceSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.business_service_selector_html;
  }    
  business_serviceEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function business_serviceEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.business_service_editor_html;
  }    

  BusinessServiceSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.authz.Authz",
                                     "spa-demo.subjects.BusinessService"];
  function BusinessServiceSelectorController($scope, $stateParams, Authz, BusinessService) {
    var vm=this;

    vm.$onInit = function() {
      console.log("BusinessServiceSelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                    function(){ 
                      if (!$stateParams.id) { 
                        vm.items = BusinessService.query(); 
                      }
                    });
    }
    return;
    //////////////
  }


  BusinessServiceEditorController.$inject = ["$scope","$q",
                                   "$state", "$stateParams",
                                   "spa-demo.authz.Authz",                                   
                                   "spa-demo.subjects.BusinessService",
                                   "spa-demo.subjects.BusinessServiceThing",
                                   "spa-demo.subjects.BusinessServiceLinkableThing",
                                   ];

  function BusinessServiceEditorController($scope, $q, $state, $stateParams, 
                                 Authz, BusinessService, BusinessServiceThing,BusinessServiceLinkableThing) {
    var vm=this;
    vm.selected_linkables=[];
    vm.create = create;
    vm.clear  = clear;
    vm.update  = update;
    vm.remove  = remove;
    vm.linkThings = linkThings;

    vm.$onInit = function() {
      console.log("BusinessServiceEditorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                    function(){ 
                      if ($stateParams.id) {
                        reload($stateParams.id);
                      } else {
                        newResource();
                      }
                    });
    }
    return;
    //////////////
    function newResource() {
      console.log("newResource()");
      vm.item = new BusinessService();
      vm.business_servicesAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(business_serviceId) {
      var itemId = business_serviceId ? business_serviceId : vm.item.id;
      console.log("re/loading business_service", itemId);
      vm.item = BusinessService.get({id:itemId});
      vm.things = BusinessServiceThing.query({business_service_id:itemId});
      vm.linkable_things = BusinessServiceLinkableThing.query({business_service_id:itemId});
      vm.business_servicesAuthz.newItem(vm.item);
      $q.all([vm.item.$promise,
              vm.things.$promise]).catch(handleError);
    }

    function clear() {
      newResource();
      $state.go(".", {id:null});
    }

    function create() {
      vm.item.$save().then(
        function(){
           $state.go(".", {id: vm.item.id}); 
        },
        handleError);
    }

    function update() {
      vm.item.errors = null;
      var update=vm.item.$update();
      linkThings(update);
    }

    function linkThings(parentPromise) {
      var promises=[];
      if (parentPromise) { promises.push(parentPromise); }
      angular.forEach(vm.selected_linkables, function(linkable){
        var resource=BusinessServiceThing.save({business_service_id:vm.item.id}, {thing_id:linkable});
        promises.push(resource.$promise);
      });

      vm.selected_linkables=[];
      console.log("waiting for promises", promises);
      $q.all(promises).then(
        function(response){
          console.log("promise.all response", response); 
          $scope.business_serviceform.$setPristine();
          reload(); 
        },
        handleError);    
    }

    function remove() {
      vm.item.errors = null;
      vm.item.$delete().then(
        function(){ 
          console.log("remove complete", vm.item);          
          clear();
        },
        handleError);      
    }


    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.item["errors"]=response.data.errors;          
      } 
      if (!vm.item.errors) {
        vm.item["errors"]={}
        vm.item["errors"]["full_messages"]=[response]; 
      }      
      $scope.business_serviceform.$setPristine();
    }    
  }

})();
