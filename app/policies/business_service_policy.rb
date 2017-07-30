class BusinessServicePolicy < ApplicationPolicy
  def index?
    true
  end
  def show?
    true
  end
  def create?
    @user
  end
  def update?
    organizer?
  end
  def destroy?
    organizer_or_admin?
  end

  def get_things?
    true
  end

  class Scope < Scope
    def user_roles

      pp "we are in roles"
      #pp BusinessServices.id
      pp "88888888888888888888888888888"

      joins_clause=["left join Roles r on r.mname='BusinessService'",
                    "r.mid=BusinessService.id",
                    "r.user_id #{user_criteria}"].join(" and ")
      # scope.select("BusinessServices.*, r.role_name")
      #      .joins(joins_clause

      scope.select("*")
      pp scope
      return scope     
    end

    def resolve
      #scope
      user_roles
    end
  end
end
