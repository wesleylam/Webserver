const { query } = require('express');
var express = require('express');
var router = express.Router();

/* GET tables page. */
router.get('/', function(req, res, next) {

    // .../table?table=***
    if (Object.keys(req.query).length === 1){
        let query = req.db.from(req.query.table).select('*');
        
        query.then((rows) => {
            res.json({ result: rows});
            
        }).catch((e) => {
            console.log(e)
            res.status(400).json({ message: "oops! your query has some problems" })
        });

    } else { // .../table
        let query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?'
        let bindings = [ req.db.client.database() ]

        req.db.raw(query, bindings).then(function(results) {
            let ts = results[0].map((row) => row.TABLE_NAME);
            res.json({ "tables": ts });
            console.log(ts);
        }).catch((e) => {
            console.log(e)
            res.status(400).json({ message: "oops! your query has some problems" })
        });
    }

});

/* GET tables info page. */
router.get('/columnInfo', function(req, res, next) {

    // .../table/info?table=***
    if (Object.keys(req.query).length === 1){
        let query = req.db.table(req.query.table).columnInfo();
    
        query.then((rows) => {
            // console.log(rows)
            // console.log(Object.keys(rows))
            // console.log(Object.keys(rows).length)
            res.json({ columnInfo: rows});
        }).catch((e) => {
            throw new Error("internal error when getting column info");
        });

    } else {
        let message = "no table name given";
        console.log("error: " + message);
        res.status(401).json({ message: message });
    }

});


// -------------------------------------- POST ------------------------------------------- //
function respond(query, res, successMessage){
    query.then((results) => {
        res.status(200).json({ message: successMessage });
    }).catch((e) => {
        let message = "error occurred";
        console.log("error: " + e);
        res.status(401).json({ message: message, e: e.code });
    });
}
/* POST create table
body{
    table: the table name,
    fields: {
        fieldName: fieldType
        (eg:)
        name: text,
        ...
    },
}
*/
router.post('/create-table', function(req, res, next) {

    var query = req.db.schema.createTable(req.body.table, (table) => {
            // mandatory ID
            table.integer('ID', { primaryKey: true });
            for (const fname in req.body.fields){
                // witch statement to define diff fieldtypes
                switch(req.body.fields[fname]) {
                    case "integer":
                        table.integer(fname);
                        break;
                    case "bigInteger":
                        table.bigInteger(fname);
                        break;
                    case "text":
                        table.text(fname);
                        break;
                    case "string":
                        table.string(fname);
                        break;
                    case "float":
                        table.float(fname);
                        break;
                    case "decimal":
                        table.decimal(fname);
                        break;
                    case "boolean":
                        table.boolean(fname);
                        break;
                    case "date":
                        table.date(fname);
                        break;
                    case "datetime":
                        table.datetime(fname);
                        break;
                    case "time":
                        table.time(fname);
                        break;
                    case "timestamp":
                        table.timestamp(fname);
                        break;
                    default:
                        break;
                }
            }
        });

    respond(query, res, "Table created");
});

/* POST drop table
body{
    table: the table name,
}
*/
router.post('/drop-table', function(req, res, next) {
    var query = req.db.schema.dropTable(req.body.table);
    respond(query, res, "Table deleted");
});



/* POST create new table entry. 
body{
    table: the table name,
    data: JSON of data of the inserting row,
}
*/
router.post('/create-entry', function (req, res, next) {
    var query = req.db(req.body.table).insert(req.body.data);

    respond(query, res, "Inserted");
});

/* POST edit a table entry. 
body{
    table: the table name,
    key: primary key (ID),
    data: JSON of edited entries,
}
*/
router.post('/edit-entry', function (req, res, next) {
    console.log(req.body);
    console.log(req.body.key);
    console.log(req.body.data);
    var query = req.db(req.body.table).where(req.body.key).update(req.body.data);
    
    respond(query, res, "Updated");
});

/* POST delete a table entry. 
body{
    table: the table name,
    key: primary key (ID),
}
*/
router.post('/del-entry', function (req, res, next) {

    var query = req.db(req.body.table).where(req.body.key).del();

    respond(query, res, "Deleted")
});


module.exports = router;
