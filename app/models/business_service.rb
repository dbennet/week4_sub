class BusinessService < ActiveRecord::Base
  include Protectable
  has_many :thing_services, inverse_of: :business_service, dependent: :destroy
  has_many :things, through: :thing_services
end
