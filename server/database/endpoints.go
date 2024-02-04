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

func findMany[T any](collectionName string, query *T) ([]T, error) {
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
	var results []T

	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	// Prints the results of the find operation as structs
	// for _, result := range results {
	// 	cursor.Decode(&result)
	// 	output, err := json.MarshalIndent(result, "", "    ")
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// 	fmt.Printf("%s\n", output)
	// }

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
