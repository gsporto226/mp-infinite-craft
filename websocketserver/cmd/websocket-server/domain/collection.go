package domain

import "github.com/google/uuid"

type Collection[T any] interface {
	Get(uuid.UUID) (T, error)
	Create(T) error
}
