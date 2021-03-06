"use strict";

/*import * as firebase from 'E:\\nodejs\\node_global\\node_modules\\firebase';*/

/*抽象数据库工厂*/
class AbsDBFactory {
    constructor() {
        this.db = null;
        this.db = this.connect()
    }

    connect() {

    }

    db_set_data() {

    }

    db_get_data() {

    }

    db_delete_doc(){}
}

/*具体 firebase数据库*/
class FireBaseDBFactory extends AbsDBFactory {


    /*数据库*/
    connect() {
        this._collection = "users";


        let firebaseConfig = {
            apiKey           : "AIzaSyAcuEDPktUr79r2cT0CQDhsN1xVCRNhISs",
            authDomain       : "github-comment.firebaseapp.com",
            databaseURL      : "https://github-comment.firebaseio.com",
            projectId        : "github-comment",
            storageBucket    : "github-comment.appspot.com",
            messagingSenderId: "128561426333",
            appId            : "1:128561426333:web:b73e218ee736304e4a4974",
            measurementId    : "G-ZS85H7H49J",
        };
        /*init*/
        firebase.initializeApp(firebaseConfig);
        let db = firebase.firestore();
        return db
        // firebase.analytics();

    }

    //set
    db_set_data(doc, value) {
        let _collection = this._collection;
        this.db.collection(_collection).doc(doc).set(value);
    }


    //get
    db_get_data(extra) {
        let _collection                     = this._collection;
        const {index, query_field, factory} = extra;
        let doc                             = query_field;
        let docRef                          = this.db.collection(_collection).doc(doc);

        docRef.get()
            .then(function (doc) {
                if (doc.exists) {
                    let data = doc.data()
                    let comment = data.comment;
                    console.info("Document data:", data);
                    // console.info("comment data:", comment);
                    factory.addDom_TextArea(index, comment, query_field)

                }
                else {
                    console.info("No such document!");
                    let comment = "";
                    factory.addDom_TextArea(index, comment, query_field)
                }
            })
            .catch(function (error) {
                console.error("Error getting document:", error);
            });
    }
    //del
    db_delete_doc(doc){
        let _collection                     = this._collection;
        let docRef                          = this.db.collection(_collection).doc(doc);

        docRef.delete()
    }

}

/*具体 Mongodb数据库*/
class RemoteDBFactory extends AbsDBFactory {
    connect() {

    }
}

//
class DBManager {

    static get_factory(db_type = "firebase") {
        let factory = null;

        if (db_type === "firebase") {
            console.info("db_type:",db_type);
            factory = new FireBaseDBFactory()
        }
        return factory
    }

}


export {

    DBManager,
}
