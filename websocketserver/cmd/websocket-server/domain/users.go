package domain

import (
	"database/sql"
	"fmt"

	"github.com/google/uuid"
)

const (
	tableName = "users"
)

type User struct {
	ID uuid.UUID `bson:"id"`
}

type UserCollection struct {
	db *sql.DB
}

func NewUserCollection(db *sql.DB) UserCollection {
	return UserCollection{
		db,
	}
}

func (userCollection *UserCollection) Get(id uuid.UUID) (User, error) {
	row := userCollection.db.QueryRow(fmt.Sprintf("SELECT * from %s WHERE id = $1", tableName), id)
	var user User
	err := row.Scan(&user.ID)
	if err != nil {
		return user, err
	}
	return user, nil
}

func (userCollection *UserCollection) Create(user *User) error {
	_, err := userCollection.db.Exec(fmt.Sprintf("INSERT INTO %s (id) VALUES ($1)", tableName), user.ID)
	if err != nil {
		return err
	}
	return err
}

func (userCollection *UserCollection) EnsureTable() {
	query := fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (id BLOB NOT NULL PRIMARY KEY)", tableName)
	_, err := userCollection.db.Exec(query)
	if err != nil {
		panic(err)
	}
}
