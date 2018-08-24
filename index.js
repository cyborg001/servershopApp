const express = require('express');
const app = express()
const PORT = process.env.PORT || 5000

app.set('view engine','ejs');

let bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
let Cliente = require('./Cliente.js');

app.use('/public',express.static('public'));

app.use('/createCliente',(req,res)=>{
	console.log(req.body);
	let servicio='';
	if(req.body.manicure==='on'){
		servicio='manicure';
	}else{
		servicio='cortes';
	}
	let newCliente = new Cliente({
			nombre:req.body.nombre,
			telefono:req.body.telefono,
			servicio:servicio,
		});
	console.log(''+newCliente)

	newCliente.save((err)=>{
		if(err){
			res.type('html').status(500);
			res.send('Error: '+err);
		}else{
			res.type('html').status(200);
			res.write('<h3>Cliente creado</h3>');
			res.write('<p>');
			res.write(req.body.nombre);
			res.write('<p>');
			res.write("<a href='/'>volver atras</a>");
			res.end();
		}
		
	});


});
app.use('/api',(req,res)=>{
	Cliente.find({},(err,clientes)=>{
		if(err){
			res.type('html').status(500);
			res.send('Error: '+err);
		}else{
			res.json(clientes);
		}
	});
});

app.use('/',(req,res)=>{
	res.send('bienvenido a las apis de barbershop')
});

app.listen(5000,()=>{
	console.log('Listening on port 5000')
	let hora = new Date().getHours();
	console.log(hora);
	if(hora >= 22){
		console.log('esta es la hora '+hora)
		Cliente.remove({},function(err){
			if(err){
				console.log("Error: "+err);
			}else{
				console.log('success');
			}
		})
	}
});