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

func GetComponent[T any](world *World, entityId EntityID) (*T, bool) {
	entityRecord, ok := world.entities[entityId]
	if !ok {
		return nil, false
	}
	componentKind := ComponentKindFor[T]()
	archetypeMap, ok := world.componentArchetypeMap[componentKind.id]
	if !ok {
		return nil, false
	}
	archetypeRecord, ok := archetypeMap[entityRecord.ArchetypeId]
	if !ok {
		return nil, false
	}
	archetype, ok := world.archetypes.GetArchetype(entityRecord.ArchetypeId)
	if !ok {
		return nil, false
	}
	component, ok := archetype.Components[archetypeRecord.column][entityRecord.Row].(T)
	if !ok {
		return nil, false
	}
	return &component, true
}

func (world *World) AddSystem() {}

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
