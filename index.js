const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const PUERTO = 3003;

const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'androidcrud',
    user: 'root',
    password: ''
});

// Conectar a la base de datos
conexion.connect(error => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

// Ruta de prueba
app.get('/api/prueba', (req, res) => {
    res.send('¡Servidor y base de datos están funcionando correctamente!');
});

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});

app.get('/', (req, res) => {
    res.send('API')
})

app.get('/usuarios', (req, res) => {
    const query = `SELECT * FROM usuario`;
    conexion.query(query, (error, resultado) => {
        if (error) {
            console.error(error.message);
            return res.status(500).json({ error: 'Error al ejecutar la consulta.' }); 
        }
        
        const obj = {};
        if (resultado.length > 0) { 
            obj.listaUsuarios = resultado;
            res.json(obj);
        } else {
            res.json('No hay registros'); 
        }
    });
    app.get('/usuario/:id', (req, res) => {
        const {id} = req.params
        const query = `SELECT * FROM usuario WHERE idUsuario=${id}`;
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)
            
            
            if (resultado.length > 0) { 
                res.json(resultado);
            } else {
                res.json('No hay registros');
            }
        });
    });
});
app.post('/usuario/add', (req, res) => {
    const usuario = {
        nombre: req.body.Nombre,
        apellido: '',
        correo: req.body.Correo
    }
    const query = `INSERT INTO usuario SET ? `;
    conexion.query(query, usuario, (error) => {
        if (error) return console.error(error.message)

            res.json('Se agregó correctamente el usuario');
    });
});
app.put('/usuario/update/:id', (req, res) => {
    const { id }= req.params
    const { Nombre, Correo } = req.body
    const query = `UPDATE usuario SET Nombre = '${Nombre}', Correo = '${Correo}' WHERE id= ${id}`;
    conexion.query(query, (error) => {
        if (error) return console.error(error.message)
        
       
            res.json('Se actualizó correctamente el usuario');
    });
});

app.delete('/usuario/delete/:id', (req, res) => {
    const {id} = req.params

    const query = `DELETE FROM usuario  WHERE id=${id}`;
    conexion.query(query, (error) => {
        if(error) console.error(error.message)

            res.json('Se eliminó correctamente el usuario')
    })
})
