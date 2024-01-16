package database

import (
	"context"
	"server/environment"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func Setup() error {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(environment.Env.MongoDbUri))
	if err != nil {
		panic(err)
	}
	
	// defer func() {
	// 	if err := client.Disconnect(context.TODO()); err != nil {
	// 		panic(err)
	// 	}
	// }()
		
	db = client.Database(environment.Env.MongoDbName)
	return nil

	// coll := client.Database(database).Collection("users")

	// var result bson.M
	// err = coll.FindOne(context.TODO(), bson.D{{"username", "Daqy"}}).Decode(&result)
	// if err == mongo.ErrNoDocuments {
	// 	fmt.Printf("No document was found with the username")
	// 	return
	// }
	// if err != nil {
	// 	panic(err)
	// }
	// jsonData, err := json.MarshalIndent(result, "", "    ")
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Printf("%s\n", jsonData)
}