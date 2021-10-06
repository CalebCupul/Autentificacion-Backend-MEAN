const { response } = require('express');
const { db } = require('../models/Usuario');
const Usuario = require('../models/Usuario');

const crearUsuario = async(req, res = response) => {

    const { email, name, password } = req.body;

    try {
        
        // Verificar el email
        const usuario = await Usuario.findOne({ email });

            //Si el usuario ya existe
            if( usuario ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya existe con ese email'
                })
            }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );


        // Hash de contrasena



        // Generar JWT


        // Crear usuario de la BD
        await dbUser.save();


        // Generar respuesta exitsa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,

        });



    } catch (error) {

        return res.status(500).json({ 
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }
    
    
    


    
}

const loginUsuario =  (req, res = response) => {
    
    const { email, password } = req.body;

    return res.json({
        ok: true,
        msg: 'Login de usuario /'
    });
}

const revalidarToken = (req, res = response) => {

    return res.json({
        ok: true,
        msg: 'Renew'
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}