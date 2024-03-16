package user

type UserStorage struct {
	user_directory_path string
}

func (user_storage *UserStorage) Save() {}

func (user_storage *UserStorage) Load() {}

func (user_storage *UserStorage) List() {}
