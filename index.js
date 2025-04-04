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

app.get('/students/:student_id/grades/', async (req, res) => {
    const studentId = req.params.student_id;
    console.log("Student ID:", studentId);
    const query = 'SELECT * FROM grades WHERE student_id = ' + studentId;
    const result = await client.query(query);
    console.log("Query Result:");
    console.table(result.rows);
    res.send(result.rows);
});

app.post('/students/:student_id/grades/', async (req, res) => {
    const studentId = parseInt(req.params.student_id); 
    console.log("Student ID:", studentId);
    console.log("Request Body:", req.body);

    if(studentId === null || !Number.isInteger(studentId) || !isFinite(studentId)) {

        res.status(400).send('Invalid student ID');
        return;
    }
    if(req.body.course_id === null || !Number.isInteger(req.body.course_id) || !isFinite(req.body.course_id)) {

        res.status(400).send('Invalid course ID');
        return;
    }
    if(req.body.grade === null || !Number.isInteger(req.body.grade) || !isFinite(req.body.grade)) {

        res.status(400).send('Invalid grade');
        return;
    }
    const query = 'INSERT INTO grades (student_id, course_id, grade) VALUES ($1, $2, $3)';
    const values = [studentId, req.body.course_id, req.body.grade];
    await client.query(query, values);
    res.end();
});
app.listen(3000, async () => {
    await client.connect(); 
    console.log('Connected to the database');
    console.log('Server is running on port 3000');
}); 
app.on('close', async () => {
    await client.end();
    console.log('Disconnected from the database');
});