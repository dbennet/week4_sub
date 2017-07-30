require 'rails_helper'

RSpec.describe "BusinessServices", type: :request do
  describe "GET /business_services" do
    it "works! (now write some real specs)" do
      get business_services_path
      expect(response).to have_http_status(200)
    end
  end
end
