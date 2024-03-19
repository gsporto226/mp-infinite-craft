package ecs

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestComponentIdSet(t *testing.T) {
	set := NewComponentIdSet()
	set.Add(0)
	set.Add(1)
	set.Add(2)
	set.Add(2)
	assert.True(t, set.Has(0))
	assert.True(t, set.Has(1))
	assert.True(t, set.Has(2))
	assert.Equal(t, set.size, 3)
	set.Remove(1)
	assert.True(t, set.Has(0))
	assert.False(t, set.Has(1))
	assert.True(t, set.Has(2))
	assert.Equal(t, set.size, 2)
	set.Remove(1)
	assert.True(t, set.Has(0))
	assert.False(t, set.Has(1))
	assert.True(t, set.Has(2))
	assert.Equal(t, set.size, 2)
}

func TestHash(t *testing.T) {
	referenceIdentity := NewComponentIdSet()
	referenceIdentity.Add(0)
	referenceIdentity.Add(1)
	sameOrder := NewComponentIdSet()
	sameOrder.Add(0)
	sameOrder.Add(1)
	withDifferentOrder := NewComponentIdSet()
	withDifferentOrder.Add(1)
	withDifferentOrder.Add(0)
	withDifferentValues := NewComponentIdSet()
	withDifferentValues.Add(0)
	withDifferentValues.Add(1)
	withDifferentValues.Add(2)
	withDuplicates := NewComponentIdSet()
	withDuplicates.Add(0)
	withDuplicates.Add(0)
	withDuplicates.Add(1)
	withRemoval := withDifferentValues
	withRemoval.Remove(2)
	withEqualSums := NewComponentIdSet()
	withEqualSums.Add(1)
	assert.Equal(t, referenceIdentity.Hash(), referenceIdentity.Hash(), "Hashes of the same value must equal themselves")
	assert.Equal(t, referenceIdentity.Hash(), sameOrder.Hash(), "Hashes of identities which contain the same values must be equal, ordered")
	assert.Equal(t, referenceIdentity.Hash(), withDifferentOrder.Hash(), "Hashes of identities which contain the same values must be equal, unordered")
	assert.Equal(t, referenceIdentity.Hash(), withDuplicates.Hash(), "Hashes of identities which contain the same values must be equal, with duplicates")
	assert.Equal(t, referenceIdentity.Hash(), withRemoval.Hash(), "Hashes of identities which had values removed and now contain the same values must be equal")
	assert.NotEqual(t, referenceIdentity.Hash(), withDifferentValues.Hash(), "Hashes of identities which contain different values must not equal")
	assert.NotEqual(t, referenceIdentity.Hash(), withEqualSums.Hash(), "Hashes of identities whose sum of its values must not equal")
}

func FuzzClone(f *testing.F) {
	f.Fuzz(func(t *testing.T, value uint64) {
		original := NewComponentIdSet()
		original.Add(value)
		assert.Equal(t, original, original.Clone())
	})

}
