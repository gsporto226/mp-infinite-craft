package ecs

import (
	"encoding/binary"
	"hash/maphash"
)

var (
	seed = maphash.MakeSeed()
)

type ComponentIdSet struct {
	innerMap        map[ComponentId]struct{}
	precomputedHash uint64
	size            int
}

func NewComponentIdSet() ComponentIdSet {
	return ComponentIdSet{
		innerMap:        make(map[uint64]struct{}),
		precomputedHash: 0,
		size:            0,
	}
}

func (set *ComponentIdSet) Clone() ComponentIdSet {
	innerMap := make(map[ComponentId]struct{})
	for key, value := range set.innerMap {
		innerMap[key] = value
	}
	return ComponentIdSet{
		innerMap:        innerMap,
		precomputedHash: set.precomputedHash,
	}
}

// Adding a value that already exists is a noop
func (set *ComponentIdSet) Add(componentId ComponentId) {
	if _, ok := set.innerMap[componentId]; !ok {
		set.innerMap[componentId] = struct{}{}
		set.precomputedHash += hashComponentId(componentId)
		set.size += 1
	}
}

func (set *ComponentIdSet) Has(componentId ComponentId) bool {
	_, ok := set.innerMap[componentId]
	return ok
}

func (set *ComponentIdSet) Remove(componentId ComponentId) {
	if _, ok := set.innerMap[componentId]; ok {
		delete(set.innerMap, componentId)
		set.precomputedHash -= hashComponentId(componentId)
		set.size -= 1
	}
}

func (set *ComponentIdSet) Hash() uint64 {
	return set.precomputedHash
}

func hashComponentId(componentId ComponentId) uint64 {
	var hash ComponentSetHash
	bytes := make([]byte, componentIdSize)
	binary.NativeEndian.PutUint64(bytes, componentId)
	hash += maphash.Bytes(seed, bytes)
	return hash
}
