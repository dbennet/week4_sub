class ThingServicesController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  wrap_parameters :thing_service, include: ["business_service_id", "thing_id", "priority"]
  before_action :get_thing, only: [:index, :update, :destroy]
  before_action :get_service, only: [:service_things]
  before_action :get_thing_service, only: [:update, :destroy]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  #after_action :verify_policy_scoped, only: [:linkable_things]

  def index
    authorize @thing, :get_services?
    pp "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    # @thing_services = @thing.thing_services.prioritized.with_caption
     @thing_services = BusinessService.where(id: @thing.thing_services.prioritized.with_caption.pluck("business_service_id"))
  end

  def service_things
    authorize @business_service, :get_things?
    @thing_services=@business_service.thing_services.prioritized.with_name
    pp @thing_services.map {|ts| ts.attributes}
    render :index 
  end

  def linkable_things
    authorize Thing, :get_linkables?
    service = BusinessService.find(params[:business_service_id])
    @things=Thing.not_linked(service)
    @things=ThingPolicy::Scope.new(current_user,@things).user_roles(true,false)
    @things=ThingPolicy.merge(@things)
    render "things/index"
  end

  def create
    thing_service = ThingService.new(thing_service_create_params.merge({
                                  :business_service_id=>params[:business_service_id],
                                  :thing_id=>params[:thing_id],
                                  }))
    thing=Thing.where(id:thing_service.thing_id).first
    if !thing
      full_message_error "cannot find thing[#{params[:thing_id]}]", :bad_request
      skip_authorization
    elsif !BusinessService.where(id:thing_service.business_service_id).exists?
      full_message_error "cannot find service[#{params[:business_service_id]}]", :bad_request
      skip_authorization
    else
      authorize thing, :add_service?
      thing_service.creator_id=current_user.id
      if thing_service.save
        head :no_content
      else
        render json: {errors:@thing_service.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def update
    authorize @thing, :update_service?
    if @thing_service.update(thing_service_update_params)
      head :no_content
    else
      render json: {errors:@thing_service.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @thing, :remove_service?
    @thing_service.destroy
    head :no_content
  end

  private
    def get_thing
      @thing ||= Thing.find(params[:thing_id])
    end
    def get_service
      @business_service ||= BusinessService.find(params[:business_service_id])
    end
    def get_thing_service
      @thing_service ||= ThingService.find(params[:id])
    end

    def thing_service_create_params
      params.require(:thing_service).tap {|p|
          #_ids only required in payload when not part of URI
          p.require(:service_id)    if !params[:business_service_id]
          p.require(:thing_id)    if !params[:thing_id]
        }.permit(:priority, :service_id, :thing_id)
    end
    def thing_service_update_params
      params.require(:thing_service).permit(:priority)
    end
end