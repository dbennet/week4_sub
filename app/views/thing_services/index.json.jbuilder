# json.extract! @thing_services, :id, :created_at, :updated_at

#json.array!(@thing_services) do |ti|
#	json.extract! ti, :id, :created_at, :updated_at
#end

json.array!(@thing_services) do |ti|
  json.extract! ti, :id, :thing_id, :creator_id, :created_at, :updated_at
  json.thing_name ti.thing_name        if ti.respond_to?(:thing_name)
  #json.image_caption ti.image_caption  if ti.respond_to?(:image_caption)
end