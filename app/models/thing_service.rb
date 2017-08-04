class ThingService  < ActiveRecord::Base
  belongs_to :business_service
  belongs_to :thing

  validates :business_service, :thing, presence: true

  scope :prioritized,  -> { order(:priority=>:asc) }
  scope :things,       -> { where(:priority=>0) }
  scope :primary,      -> { where(:priority=>0).first }

  #scope :with_name,    ->{ joins(:thing).select("thing_business_services.*, things.name as thing_name")}
  scope :with_name,    ->{ joins(:thing).select("thing_services.*, things.name as thing_name")}
  #scope :with_caption, ->{ joins(:business_service).select("thing_services.*, Business_Services.caption as business_service_caption")}
  scope :with_caption, ->{ joins(:business_service).select("thing_services.*,business_services.*")}
end

