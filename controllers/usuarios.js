const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page, limit } = req.query;
  const { limite = 5, desde = 0 } = req.query; //lo que viene depues del ? en el url

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true })
      .skip(parseInt(desde))
      .limit(parseInt(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, estado, ...resto } = req.body;

  //TODO validar contra base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //verificar si el correo existe

  //Encriptar la contrasena
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.json(usuario);
};

const usuarioDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // const uid = req.uid;
  //fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAuth = req.usuario;

  res.json({ usuario, usuarioAuth });
};

const usuarioPatch = (req, res = response) => {
  res.json({ msg: "Patch API - controlador" });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuarioDelete,
  usuarioPatch,
};
