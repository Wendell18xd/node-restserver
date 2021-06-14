const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETKEY);
    req.uid = uid;

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        mgs: "Token no valido - usuario no existe",
      });
    }

    //verificar si el uid tiene estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        mgs: "Token no valido - usuario eleiminado",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log("Error en el catch", error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};