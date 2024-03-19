package ecs

import "reflect"

type ComponentId = ID

type ComponentKind[T any] struct {
	id ComponentId
}

var (
	componentIds    = make(map[reflect.Kind]any)
	nextComponentId = ComponentId(0)
)

func ComponentKindFor[T any]() ComponentKind[T] {
	kind := reflect.TypeFor[T]().Kind()
	componentKind, ok := componentIds[kind].(ComponentKind[T])
	if !ok {
		componentKind = ComponentKind[T]{
			id: nextComponentId,
		}
		nextComponentId += 1
	}
	return componentKind
}
