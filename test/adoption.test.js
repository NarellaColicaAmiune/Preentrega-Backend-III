import supertest from "supertest";
import app from "../src/app.js";
import chai from "chai";
import Adoption from "../src/dao/Adoption.js";
import Pet from "../src/dao/Pets.dao.js";
import User from "../src/dao/Users.dao.js";

const adoption = new Adoption();
const pet = new Pet();
const user = new User();

const expect = chai.expect;
const request = supertest(app);

before(async () => {
    await user.deleteAll({});
    await pet.deleteAll({});
    await adoption.deleteAll({});
    const result = await user.save({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password: "password123",
        role: "user",
        pets: []
    })

    const result2 = await pet.save({
        name: "Buddy",
        specie: "Dog",
        adopted: false,
        owner: result.id,
    })

    await adoption.save({
        owner: result.id,
        pet: result2.id,
    });
});

describe("Rutas de adopción", () => {
    it("GET /api/adoptions - Obtener todas las adopciones", async () => {
        const response = await request.get("/api/adoptions");
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an("array");
    });
});

describe("Rutas de adopción con ID", () => {
    it("GET /api/adoptions/:aid - Obtener una adopción por ID", async () => {
        const responseId = await adoption.get({});
        const response = await request.get(`/api/adoptions/${responseId[0]._id}`);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an("object");
    });
});

describe("Ruta creación de adopción", () => {
    it("POST /api/adoptions - Crear una nueva adopción", async () => {
        const responseId = await user.save({
            first_name: "Peter",
            last_name: "Dickson",
            email: "peterdickson@example.com",
            password: "password123456",
            role: "user",
            pets: []
        });
        const responsePet = await pet.save({
            name: "Rocky",
            specie: "Dog",
            adopted: false,
            owner: responseId._id,
        });
        const response = await request.post(`/api/adoptions/${responseId._id}/${responsePet._id}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("object");
    });
})



// CASOS DE ERROR
describe("Errores en rutas de adopciones", () => {
    it("GET /api/adoptions/:aid - Debería fallar si la adopción no existe", async () => {
        const fakeId = "666666666666666666666666";
        const response = await request.get(`/api/adoptions/${fakeId}`);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error");
    });

    it("POST /api/adoptions/:uid/:pid - Debería fallar si el usuario no existe", async () => {
        const fakeUserId = "666666666666666666666666";
        const createdPet = await pet.save({
            name: "Chiquito",
            specie: "Dog",
            adopted: false,
            owner: fakeUserId,
        });

        const response = await request.post(`/api/adoptions/${fakeUserId}/${createdPet._id}`);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error");
    });

    it("POST /api/adoptions/:uid/:pid - Debería fallar si la mascota no existe", async () => {
        const createdUser = await user.save({
            first_name: "Test",
            last_name: "User",
            email: `testuser${Date.now()}@mail.com`,
            password: "pass123",
            role: "user",
            pets: [],
        });

        const fakePetId = "666666666666666666666666";
        const response = await request.post(`/api/adoptions/${createdUser._id}/${fakePetId}`);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("error");
    });

    it("POST /api/adoptions/:uid/:pid - Debería fallar si la mascota ya está adoptada", async () => {
        const userAdopter = await user.save({
            first_name: "Adoptador",
            last_name: "Final",
            email: `adoptador${Date.now()}@mail.com`,
            password: "pass123",
            role: "user",
            pets: [],
        });

        const adoptedPet = await pet.save({
            name: "Toby",
            specie: "Dog",
            adopted: true,
            owner: userAdopter._id,
        });

        const response = await request.post(`/api/adoptions/${userAdopter._id}/${adoptedPet._id}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("error");
    });
});