import { Router } from 'express';
import { generatePets, generateUsers, generateData, getUsers, getPets  } from '../services/mocking.service.js';

const router = Router();

router.get('/mockingpets', (req, res, next) => {
    try {
    const quantity = req.query.quantity||100;
    const pets = generatePets(quantity);
    res.json(pets);
    } catch (error) {
        next(error);
    }
});

router.get('/mockingusers', async (req, res, next) => {
    try {
    const quantity = req.query.quantity||50;
    const users = await generateUsers(quantity);
    res.json(users);
    } catch (error) {
        next(error);
    }
});

router.post('/generatedata', async (req, res, next) => {
    try {
    const usersQuantity = req.query.users||50;
    const petsQuantity = req.query.pets||100;
    const data = await generateData(usersQuantity, petsQuantity);
    res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/users', async (req, res, next) => {
    try {
    const users = await getUsers();
    res.json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/pets', async (req, res, next) => {
    try {
    const pets = await getPets();
    res.json(pets);
    } catch (error) {
        next(error);
    }
});

export default router;