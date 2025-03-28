const express = require('express');
const pg = require('pg');
const app = express();
const client = new pg.Client({
    user: 'user12', 
    host: '192.168.0.207',
    database: 'user12_db',
    password: 'YUFXYNHZ', 
    port: 5432, 
});


app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello World!');

});
app.get('/grades/:student_id/', async (req, res) => {
    const studentId = req.params.student_id;
    console.log("Student ID:", studentId);
    const query = 'SELECT * FROM grades WHERE student_id = ' + studentId;
    const result = await client.query(query);
    console.log("Query Result:");
    console.table(result.rows);
    res.end();
});
app.post('/grades/:student_id/', async (req, res) => {
    const studentId = req.params.student_id;
    console.log("Student ID:", studentId);
    console.log("Request Body:", req.body);
    res.end();
});
app.listen(3000, async () => {
    await client.connect()
    console.log('Połaczonie do bazy');
    console.log('Server is running on port 3000');
}); 
app.on('close', async () => {
    await client.end();
    console.log('Disconnected from the database');
});