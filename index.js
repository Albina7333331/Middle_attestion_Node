const express = require('express');
const fs = require('fs');
const path = require('path');



const joi = require('joi');

const app = express();
const PORT = 3000;


const usersFilePath = path.join(__dirname, 'users.json');


app.use(express.json());





// Функция для чтения пользователей из файла
const readUsersFromFile = () => {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    }
    return [];
};

// Функция для записи пользователей в файл
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};


const userSchema = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.string().min(0).max(150).required(),
    city: joi.string().min(1)
});


app.get('/', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});




app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});


app.get('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const user = users.find((u) => u.id === parseInt(req.params.id));

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


app.post('/users', (req, res) => {
    const { firstName, secondName, age, city } = req.body;

    if (!firstName || !secondName || !age || !city) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsersFromFile();
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        firstName,
        secondName,
        age,
        city,
    };

    users.push(newUser);
    writeUsersToFile(users);

    res.status(201).json(newUser);
});


app.put('/users/:id', (req, res) => {
    const { firstName, secondName, age, city } = req.body;
    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));

    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            firstName: firstName || users[userIndex].firstName,
            secondName: secondName || users[userIndex].secondName,
            age: age || users[userIndex].age,
            city: city || users[userIndex].city,
        };

        writeUsersToFile(users);
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


app.delete('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const updatedUsers = users.filter((u) => u.id !== parseInt(req.params.id));

    if (users.length !== updatedUsers.length) {
        writeUsersToFile(updatedUsers);
        res.json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
