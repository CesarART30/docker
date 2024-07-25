// Nombre de integrantes:
/*
Moreira Palma  Joao Elian
Kelly Dayana Canchingre Quevedo
Fernandez Cedeno Jandry David
Muniz Rivas Leopoldo MIquel
Menoscal Santana Bryan Steven


*/


// Milton Angamarca




//Grupo #3:
//Jose Luis Sarabia Calderon
//Oliver Jackson Mendoza Calero
//David Javier Jaramillo Intriago
//Lilibeth Jamileth Pinargote Intriago
//Saul Ivan Castro Muñoz
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuración de MongoDB
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    try {
        // Conexión a MongoDB
        await client.connect();
        console.log('Connected successfully to MongoDB');
        const db = client.db('mydatabase'); // Asegúrate de que el nombre de la base de datos sea el correcto
        const collection = db.collection('vehicles');

        // Mostrar todos los vehículos
        app.get('/vehicles', async (req, res) => {
            try {
                const vehicles = await collection.find({}).toArray();
                res.send(vehicles);
            } catch (err) {
                res.status(500).send({ error: 'Failed to retrieve vehicles' });
            }
        });

        // Añadir un vehículo
        app.post('/addVehicle', async (req, res) => {
            const { plate, model, color } = req.body;
            if (!plate || !model || !color) {
                return res.status(400).send({ error: 'All fields are required' });
            }
            try {
                await collection.insertOne({ plate, model, color });
                res.send({ success: true });
            } catch (err) {
                res.status(500).send({ error: 'Failed to add vehicle' });
            }
        });

        // Actualizar información de un vehículo
        app.put('/updateVehicle', async (req, res) => {
            const { plate, model, color } = req.body;
            if (!plate || !model || !color) {
                return res.status(400).send({ error: 'All fields are required' });
            }
            try {
                await collection.updateOne({ plate }, { $set: { model, color } });
                res.send({ success: true });
            } catch (err) {
                res.status(500).send({ error: 'Failed to update vehicle' });
            }
        });

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Ejecutar la función principal
main().catch(console.error);

