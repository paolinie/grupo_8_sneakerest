const path = require('path');
const fs = require('fs');
const { Op } = require("sequelize");
const {products, brands, examples, images, imageproducts, genders} = require ('../database/models');



module.exports = {
    index: async (req,res) =>{   
        const zapatillas = await products.findAll({include: ['brands', 'examples']})
        //return res.send(zapatillas); 
        res.render(path.resolve(__dirname , '..','views','admin','administrarProductos') , {zapatillas});           
    },
    create: (req, res) => {
        res.render(path.resolve(__dirname, '..','views','admin','createProductos'));
    },
    save: async (req,res)=>{
        //return res.send(req.files)
        const zapatillas = await products.findAll();
        const marcas = await brands.findAll({where: {name: {[Op.like]: req.body.marca}}});
        const modelos = await examples.findAll({where: {name: {[Op.like]: req.body.modelo}}});
        const generos = await genders.findAll({where: {name: {[Op.like]: req.body.genero}}});
        let marcas_body = null;
        if(marcas.length > 1){
            marcas_body = marcas[0].id;
        } else {
            //await brands.destroy({where: {name: req.body.marca}})
            let newBrand = await brands.create({name: req.body.marca})
            marcas_body = newBrand.id;
        }
        let modelos_body = null;
        if(modelos.length > 1){
            modelos_body = modelos[0].id 
        } else {
            //await examples.destroy({where: {name: req.body.modelo}})
            let newModelo = await examples.create({name: req.body.modelo})
            modelos_body = newModelo.id
        }
        
        const zapatillas_body = { 
            //return res.send(_body);
            price: req.body.precio,
            discount: req.body.descuento,
            description: req.body.descripcion,
            color: req.body.color,
            stock: req.body.descuento,
            gender: req.body.genero,
            brand_id: marcas_body,
            example_id: modelos_body
        }
        
        let newImages = [];
        req.files.forEach(async image => {
            let newImage = await images.create({filename: image.filename})
            newImages.push(newImage.id)
        });
        //return res.send(zapatillas_body);
        let newZapatilla = await products.create(zapatillas_body)
        newImages.forEach(async imagen => {
            imageproducts.create({image_id: imagen, product_id: newZapatilla.id})           
        })        
        res.redirect(`/productos/detalle/${newZapatilla.id}`);
        //res.redirect('/adminProducts')*/
    },
    show: async (req,res)=>{
        const zapatillas = await products.findByPk(req.params.id, {include: ['brands', 'examples']});
        //return res.send(zapatillas);
        res.render(path.resolve(__dirname , '..','views','admin','detailProducto') , {zapatillas});    
        
    },
    destroy: async (req, res) => {
        let destroyZapatilla = await products.destroy({where: {id: req.params.id}, force: true})
        
        res.redirect('/adminProducts')
    },
    edit: async (req,res) => {
        const zapatillas = await products.findByPk(req.params.id, {include: ['brands', 'examples', 'images']})
        //return res.send(zapatillas);
        res.render(path.resolve(__dirname , '..','views','admin','editProductos') , {zapatillas});                       
        
    },
    updateZapatillas: async (req,res) => {
        const zapatillas = await products.findAll();
        const marcas = await brands.findAll({where: {name: {[Op.like]: req.body.marca}}});
        const modelos = await examples.findAll({where: {name: {[Op.like]: req.body.modelo}}});
        let marcas_body = null;
        let modelos_body = null;
        if (marcas.length > 1){
            //let actualizarBrand = await brands.update({name: req.body.marca})
            marcas_body = marcas[0].id
            //marcas_body = marcas[0].id;
        } else {
            //await brands.destroy({where: {name: req.body.oldBrand}})
            let newBrand = await brands.create({name: req.body.marca})
            marcas_body = newBrand.id;
        }
        if (modelos.length > 1){
            //let actualizarExample = await examples.update({name: req.body.modelo})
            modelos_body = modelos[0].id
            //modelos_body = marcas[0].id;
        } else {
            let newExample = await examples.create({name: req.body.modelo})
            modelos_body = newExample.id;
        }
        const zapatillas_body = { 
            //return res.send(_body);
            price: req.body.precio,
            description: req.body.descripcion,
            color: req.body.color,
            discount: req.body.descuento,
            stock: req.body.stock,
            gender: req.body.gender,
            brand_id: marcas_body,
            example_id: modelos_body
        }
        
        //return res.send(zapatillas_body);
        let newZapatilla = await products.update(zapatillas_body, {where: {id: req.params.id}})
        
        //Acá actualizo imagenes
        //let destroyImages = [];
        await imageproducts.destroy({where: {product_id: req.params.id}})
        
        let lastImages = await products.findByPk(req.params.id, {include: ['images']})
        lastImages.images.forEach(async imagenes => await images.destroy({where: {id: imagenes.id}}))



            let newImage1 = await images.create ({filename: req.files[0] ? req.files[0].filename : req.body.oldImagen})
            await imageproducts.create({
                product_id: req.params.id,
                image_id: newImage1.id
            })
            let newImage2 = await images.create ({filename: req.files[1] ? req.files[1].filename : req.body.oldImagen2})
            await imageproducts.create({
                product_id: req.params.id,
                image_id: newImage2.id
            })
            let newImage3 = await images.create ({filename: req.files[2] ? req.files[2].filename : req.body.oldImagen3})
            await imageproducts.create({
                product_id: req.params.id,
                image_id: newImage3.id
            })
            let newImage4 = await images.create ({filename: req.files[3] ? req.files[3].filename : req.body.oldImagen4})
            await imageproducts.create({
                product_id: req.params.id,
                image_id: newImage4.id
            })
            let newImage5 = await images.create ({filename: req.files[4] ? req.files[4].filename : req.body.oldImagen5})
            await imageproducts.create({
                product_id: req.params.id,
                image_id: newImage5.id
            })
            
        
        //return res.send(destroyImages);
        
        
        //return res.send(newZapatilla)
        //res.redirect(`/productos/detalle/${newZapatilla.id}`);
        res.redirect('/productos')
        
    }     
    
}
