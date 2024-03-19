package ecs

type World struct {
	entities              map[EntityID]EntityRecord
	archetypes            Archetypes
	componentArchetypeMap map[ComponentId]map[ArchetypeId]ArchetypeRecord
}

func NewWorld() World {
	return World{
		entities:              make(map[uint64]EntityRecord),
		archetypes:            NewArchetypes(),
		componentArchetypeMap: make(map[uint64]map[uint64]ArchetypeRecord),
	}
}

// Should be able to specify a simple query as the parameter, it should return an iterator that is a tuple of the queried components
// There should be a distinction between Readonly and mutable components
func (world *World) AddSystem() {}

// Whenever we remove an entity from a table we
// // on removing an entity from some table to put it into another, or just removing an entity:
// // entityId -> entityRecord -> EntityRecord -> archetype -> remove swap entity from archetype table
// // with last row, update last row's entity record to match its new id -> put removed entity into its new archetype

func (world *World) DestroyEntity(entityId EntityID) bool {

}

func (world *World) CreateEntity() EntityID {
	return world.archetypes.CreateEntity(NewEntity())
}

// func AddComponent[T any](world *World, entityId EntityID, component T) bool {
// 	entityRecord, ok := world.entities[entityId]
// 	if !ok {
// 		return false
// 	}
// 	componentKind := ComponentKindFor[T]()
// 	archetypeMap, ok := world.componentArchetypeMap[componentKind.id]
// 	if !ok {
// 		return false
// 	}
// 	archetypeRecord, ok := archetypeMap[entityRecord.ArchetypeId]
// 	if !ok {
// 		return false
// 	}
// 	archetype, ok := world.archetypes.GetArchetype(entityRecord.ArchetypeId)
// 	if !ok {
// 		return false
// 	}
// 	newArchetypeIdentity := archetype.Identity
// }

//
// func GetComponent[T any](world *World, entityId EntityID) (*T, bool) {
// 	entityRecord, ok := world.entities[entityId]
// 	if !ok {
// 		return nil, false
// 	}
// 	componentKind := ComponentKindFor[T]()
// 	archetypeMap, ok := world.componentArchetypeMap[componentKind.id]
// 	if !ok {
// 		return nil, false
// 	}
// 	archetypeRecord, ok := archetypeMap[entityRecord.ArchetypeId]
// 	if !ok {
// 		return nil, false
// 	}
// 	archetype, ok := world.archetypes.GetArchetype(entityRecord.ArchetypeId)
// 	if !ok {
// 		return nil, false
// 	}
// 	component, ok := archetype.Components[archetypeRecord.column][entityRecord.Row].(T)
// 	if !ok {
// 		return nil, false
// 	}
// 	return &component, true
// }
