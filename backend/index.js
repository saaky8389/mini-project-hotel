const express = require ('express');
const app = express();

const jwt = require('jsonwebtoken');

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mysql = require('mysql');
const { reset } = require('express');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_management',
});


connection.connect((err) => {
    if (err) console.log(err);
    else console.log('connected to MYSQL server')
});

const pass = "eskjnduiwehf wiudhwekd weuhuwefidw uheguweidwub wehwied uhedjwhdiu";


const verifytoken = (req, res , next) => {
    const token = req.headers.token;
    if(!token) {
        res.status({
            success: false,
            message: 'unauthorized',
            data: []
        })
    } else {
        jwt.verify(token, pass, (err, decoded) => {
            if(err){

                console.log(42, err);
                res.status(401).send({
                    success: false,
                    message: 'unauthorized sldkfjksdljf',
                    data: []
                });
            } else {
                console.log(decoded);
                req.decoded = decoded;
                next();
            }
        })
    }
}


app.get('/', (req, res) => {
    res.send('welcome to restaurant Application');
})

app.post('/login' , (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;
    const query = `SELECT * FROM login_table WHERE user_name = ? AND password = ?` ;
    connection.query(query, [user_name , password] , (err, rows) => {
        if(err) {
            console.log(err);
            res.status(500).send({
                success: false,
                message: 'server error!',
                data: []
            });
        } else{
            if(rows.length == 0) {
                res.status(401).send({
                    success: false,
                    message: 'no data found',
                    data: []
                });
            }else{
                const id = rows[0].id;
                const fullname = rows[0].fullname;
                const user_name = rows[0].user_name;
                const token = jwt.sign({id, fullname, user_name}, pass , {expiresIn: '5'});
                res.status(200).send({
                    success: true,
                    message: 'login succesful',
                    data: token
                }); 
            }
        }
    });
});

app.get('/get_user' , [verifytoken] ,  (req, res) => {
    const id = req.decoded.id;
    const user_id = req.decoded.user_id;
    const query = 'SELECT * FROM user ';
    connection.query(query  , [id, user_id] , (err , result) => {
         if(err) {
            console.log(err);
            res.status(500).send({
                success: false,
                message: err.sqlMessage,
                data: []
            });
         } else {
            res.status(200).send({
                sucess: true,
                message: 'restaurant fetched successfully',
                data: result
            })
         }
    });
});


app.post('/add_user' , [verifytoken], (req, res) => {
    const id = req.decoded.id;
    const user_name = req.body.user_name;
    const item_name = req.body.item_name;
    const bill_id = req.body.bill_id;
    const total_bill = req.body.total_bill; 
     const query = 'INSERT INTO user ( user_name , item_name , bill_id , total_bill) VALUES ( ?, ? , ?, ?)';
     connection.query(query, [id, user_name , item_name , bill_id , total_bill], (err , result ) => {
        if(err) {
            console.log(err.sqlMessage);
            res.status(500).send({
                success: false,
                message: err.sqlMessage,
                data: result
            });
        }  else {
            res.status(200).send({
                success: true,
                message: 'added successfully',
                data: result
            });
        }
     });
});


app.put('/update_user/:id' , [verifytoken],(req, res) => {
    const id = req.params.id;
    // const login_id = req.decoded.id;
    const user_name = req.body.user_name;
    const item_name = req.body.item_name;
    const total_bill = req.body.total_bill;
    const bill_id = req.body.bill_id;
    console.log(id, user_name, item_name, total_bill, bill_id);
   const query = 'UPDATE user SET bill_id=?, user_name=?, total_bill=? , item_name=?  WHERE id = ?';   
   connection.query(query , [ id,bill_id , user_name, total_bill , item_name, id] , (err, result) => {
       if(err){
        console.log(err.sqlMessage);
        res.status(500).send({
            success: false,
            message: err.message,
            data: result
        });
       } else {
        res.status(200).send({
            success: true,
            message: 'added successfully',
            data: result
        });
       }
   });
});

 
app.delete('/delete_user/:id', (req, res) => {
  const id = req.params.id;
//   const login_id = req.decoded.id;
  const query = 'DELETE FROM user WHERE id =?';
  connection.query(query, [id, decoded] , (err, result) => {
      if(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: err.message,
            data: []
        })
      } else {
        res.status(200).send({
            success: true,
            message: 'deleted successfully',
            data: result
        });
      }
  });
});


// app.get('/add_menu', (req, res) => {
//     const id = req.params.id;
//     const item_name = req.body.item_name;
//     const item_price = req.body.item_price;

// })






const port = 5000;
app.listen(port, () => {
    console.log('listening on port')
});



function verifyJWT(jwt) {
    jwt.verify(token, pass, (err, res) => {
        if(err){
            return false;
        }else {
            return decoded;
        }
    });
}
