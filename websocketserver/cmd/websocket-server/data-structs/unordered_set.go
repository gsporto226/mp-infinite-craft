package datastructs

type Set[V comparable] struct {
	innerMap         map[V]struct{}
	precomputed_hash uint64
}

// Adding a value that already exists is a noop
func (set *Set[V]) Add(value V) {
	if _, ok := set.innerMap[value]; !ok {
		set.innerMap[value] = struct{}{}

	}
}

// Adding a value that already exists is a noop
func (set *Set[V]) Remove(value V) {
	if _, ok := set.innerMap[value]; ok {
		delete(set.innerMap, value)
	}
}

func (set *Set[V]) Hash() uint64 {
	return set.precomputed_hash
}
