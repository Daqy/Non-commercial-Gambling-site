package database

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func findOne[T any](collectionName string, query *T) error {
	collection := db.Collection(collectionName)
	filter, _ := bson.Marshal(query)
	err := collection.FindOne(context.TODO(), filter).Decode(query)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Printf("No document was found.")
			return err
		}
		panic(err)
	}

	return nil
}

func create[T any](collectionName string, data T) (*mongo.InsertOneResult, error) {
	collection := db.Collection(collectionName)

	result, err := collection.InsertOne(context.TODO(), data)

	if err != nil {
		fmt.Printf("Failed to insert value.")
		return nil, err
	}

	return result, nil
}

func delete[T any](collectionName string, data T) (*mongo.DeleteResult, error) {
	collection := db.Collection(collectionName)

	result, err := collection.DeleteOne(context.TODO(), data)

	if err != nil {
		fmt.Printf("Failed to insert value.")
		return nil, err
	}

	return result, nil
}
