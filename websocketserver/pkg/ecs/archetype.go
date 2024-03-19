package ecs

import (
	"reflect"
)

type ArchetypeId = ID
type ComponentSetHash = uint64
type Column = []any

var (
	componentIdSize     = int(reflect.TypeFor[ComponentId]().Size())
	emptyComponentIdSet = NewComponentIdSet()
)

type ArchetypeRecord struct {
	column int
}

type Archetype struct {
	Identity   ComponentIdSet
	Components []Column
}

type Archetypes struct {
	archetypesIds   map[ComponentSetHash]ArchetypeId
	archetypes      map[ArchetypeId]Archetype
	nextArchetypeId ArchetypeId
}

func (archetypes *Archetypes) GetArchetype(archetypeId ArchetypeId) (*Archetype, bool) {
	archetype, ok := archetypes.archetypes[archetypeId]
	return &archetype, ok
}

func (archetypes *Archetypes) createArchetype(componentIdSet *ComponentIdSet) (ArchetypeId, *Archetype) {
	id := archetypes.nextArchetypeId
	archetypes.nextArchetypeId += 1
	archetypes.archetypesIds[componentIdSet.Hash()] = id
	archetype := Archetype{
		Identity:   componentIdSet.Clone(),
		Components: make([][]any, 0),
	}
	archetypes.archetypes[id] = archetype
	return id, &archetype
}

func (archetypes *Archetypes) GetArchetypeFromComponentSet(componentIdSet *ComponentIdSet) (ArchetypeId, *Archetype, bool) {
	if archetypeId, ok := archetypes.archetypesIds[componentIdSet.Hash()]; ok {
		if archetype, ok := archetypes.archetypes[archetypeId]; ok {
			return archetypeId, &archetype, true
		}
	}
	return 0, nil, false
}

func (archetypes *Archetypes) GetOrCreateArchetype(componentIdSet *ComponentIdSet) (ArchetypeId, *Archetype) {
	if archetypeId, archetype, ok := archetypes.GetArchetypeFromComponentSet(componentIdSet); ok {
		return archetypeId, archetype
	}
	return archetypes.createArchetype(componentIdSet)
}

// func (archetypes *Archetypes) CreateEntity(entityId EntityID) EntityID {
// 	archetypeId, archetype := archetypes.GetOrCreateArchetype(&emptyComponentIdSet)
// }

// Swaps last element
func (archetype *Archetype) RemoveEntity(archetypeRecord *ArchetypeRecord) bool {

}

func NewArchetypes() Archetypes {
	archetypes := Archetypes{
		archetypesIds:   make(map[uint64]uint64),
		archetypes:      make(map[uint64]Archetype),
		nextArchetypeId: ArchetypeId(0),
	}
	return archetypes
}
