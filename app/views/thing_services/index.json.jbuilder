# json.extract! @thing_services, :id, :created_at, :updated_at

#json.array!(@thing_services) do |ti|
#	json.extract! ti, :id, :created_at, :updated_at
#end

json.array!(@thing_services) do |ti|
  json.extract! ti, :id, :creator_id, :created_at, :updated_at
  json.caption ti.caption  if ti.respond_to?(:caption)
  json.thing_name ti.thing_name  if ti.respond_to?(:thing_name)
end
