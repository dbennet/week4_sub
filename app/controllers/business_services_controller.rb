class BusinessServicesController < ApplicationController
  before_action :set_business_service, only: [:show, :update, :destroy]
  wrap_parameters :business_service, include: ["caption"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  def index
    authorize BusinessService
    pp BusinessService.all
    #@business_services = BusinessService.all
    @business_services = policy_scope(BusinessService.all)
    #@business_services = BusinessServicePolicy.merge(@business_services)
  end

  def show
    authorize @business_service
    business_services = policy_scope(BusinessService.where(:id=>@business_service.id))
    #@business_service = BusinessServicePolicy.merge(business_services).first
    @business_service = business_services.first
  end

  def create
    authorize BusinessService
    @business_service = BusinessService.new(business_service_params)
    @business_service.creator_id=current_user.id

    User.transaction do
      if @business_service.save
        role=current_user.add_role(Role::ORGANIZER, @business_service)
        @business_service.user_roles << role.role_name
        role.save!
        render :show, status: :created, location: @business_service
      else
        render json: {errors:@business_service.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def update
    authorize @business_service

    if @business_service.update(business_service_params)
      head :no_content
    else
      render json: {errors:@business_service.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @business_service
    @business_service.destroy

    head :no_content
  end

  private

    def set_business_service
      @business_service = BusinessService.find(params[:id])
    end

    def business_service_params
      params.require(:business_service).permit(:caption)
    end
end

