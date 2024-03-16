package user

type UserSession struct {
	token        string
	user_storage UserStorage
}

func (user_session *UserSession) List_saved_sessions() {}

func (user_session *UserSession) Save_current_session() error {}
