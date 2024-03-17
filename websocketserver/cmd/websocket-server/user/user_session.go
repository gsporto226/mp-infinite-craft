package user

import "github.com/google/uuid"

type UserSession struct {
	token       uuid.UUID
	userStorage UserStorage
}

func (userSession *UserSession) List_saved_sessions() {}

// func (userSession *UserSession) Save_current_session() error {}

// func NewUserSession(userToken uuid.UUID) (UserSession, error) {
//
// }
