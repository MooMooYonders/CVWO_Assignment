// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: pages.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createPage = `-- name: CreatePage :one
INSERT INTO pages (id, created_at, updated_at, name) 
VALUES ($1, $2, $3, $4)
RETURNING id, created_at, updated_at, name
`

type CreatePageParams struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Name      string
}

func (q *Queries) CreatePage(ctx context.Context, arg CreatePageParams) (Page, error) {
	row := q.db.QueryRowContext(ctx, createPage,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Name,
	)
	var i Page
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
	)
	return i, err
}

const getPage = `-- name: GetPage :one
SELECT id, created_at, updated_at, name FROM pages where pages.name = $1
`

func (q *Queries) GetPage(ctx context.Context, name string) (Page, error) {
	row := q.db.QueryRowContext(ctx, getPage, name)
	var i Page
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
	)
	return i, err
}

const getPages = `-- name: GetPages :many
SELECT id, created_at, updated_at, name FROM pages
`

func (q *Queries) GetPages(ctx context.Context) ([]Page, error) {
	rows, err := q.db.QueryContext(ctx, getPages)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Page
	for rows.Next() {
		var i Page
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Name,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
