package database

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func findOne[Q any, R any](collectionName string, query Q, result *R) error {
	collection := db.Collection(collectionName)
	filter, _ := bson.Marshal(query)
	err := collection.FindOne(context.TODO(), filter).Decode(result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Printf("No document was found.")
			return err
		}
		panic(err)
	}

	return nil
}

func findMany[Q any, R any](collectionName string, query Q, result *R) ([]R, error) {
	collection := db.Collection(collectionName)
	filter, _ := bson.Marshal(query)

	cursor, err := collection.Find(context.TODO(), filter)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Printf("No documents were found.")
			return nil, err
		}
		panic(err)
	}
	var results []R

	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	return results, nil
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

type updateGeneric struct {
	Key   string
	Value any
}

func update[Q any](collectionName string, query Q, data updateGeneric) (*mongo.UpdateResult, error) {
	collection := db.Collection(collectionName)
	filter, _ := bson.Marshal(query)

	update := bson.D{{"$set", bson.D{{data.Key, data.Value}}}}

	result, err := collection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		fmt.Printf("Failed to update value.")
		return nil, err
	}

	return result, nil
}
