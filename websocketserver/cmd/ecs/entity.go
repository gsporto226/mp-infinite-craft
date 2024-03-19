package ecs

type EntityID = ID

var (
	nextEntityId = EntityID(0)
)

type EntityRecord struct {
	ArchetypeId ArchetypeId
	Row         int
}

func NewEntity() EntityID {
	id := nextEntityId
	nextEntityId += 1
	return id
}

func NewEntityRecord() EntityRecord {
	return EntityRecord{
		ArchetypeId: 0,
		Row:         0,
	}
}
