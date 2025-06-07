import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import Pet from '../dao/Pets.dao.js';
import Users from '../dao/Users.dao.js';

const usersDao = new Users();
const petsDao = new Pet();

export const generatePets = (quantity = 100) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        pets.push({
            name: faker.animal.cat(), 
            specie: faker.animal.type(),
            birthDate: faker.date.past(),
            adopted: false,
            owner: null,
        });
    }

    return pets;
};


export const generateUsers = async (quantity = 50) => {
    const users = [];
    const hashedPassword = await bcrypt.hash("coder123", 10);

    for (let i = 0; i < quantity; i++) {
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(["user", "admin"]),
            pets: [],
        });
    }

    return users;
};


export const generateData = async (userQuantity, petQuantity) => {
    const users = await generateUsers(userQuantity);
    const pets = generatePets(petQuantity);
    const resultUsers = await usersDao.saveMany(users);
    const resultPets = await petsDao.saveMany(pets);
    return { users: resultUsers, pets: resultPets };
};


export const getUsers = async () => {
    const users = await usersDao.get();
    return users;
};

export const getPets = async () => {
    const pets = await petsDao.get();
    return pets;
};