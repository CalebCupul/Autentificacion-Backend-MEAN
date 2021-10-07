const { response } = require('express');
const { db } = require('../models/Usuario');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

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
            // Salt consiste en generar numeros aleatorios para la validacion de la contrasena
        const salt = bcrypt.genSaltSync();
        dbUser.password =  bcrypt.hashSync( password, salt );


        // Generar JWT
        const token = await generarJWT( dbUser.id, name );

        // Crear usuario de la BD
        await dbUser.save();


        // Generar respuesta exitsa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,
            token

        });



    } catch (error) {

        return res.status(500).json({ 
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }
    
    
    


    
}

const loginUsuario =  async(req, res = response) => {
    
    const { email, password } = req.body;

    try {
        // Busca el correo en la bd
        const dbUser = await Usuario.findOne({ email });
        // Si no encuentra el correo
        if ( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        // Si la contrasena no es valida
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        // Generar JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT( uid, name );


    return res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}