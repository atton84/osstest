
//categories controller

var BaseController = require("./base/base"),
	Busboy = require('busboy'), // module for parsing multipart form-data
	path = require('path'),
	fs = require('fs'),
	model = new (require("../models/Base")), // base model (i don't create any other models, because we have only 1 table)
	config = require('../config/config')(); // application configurations

module.exports = BaseController.extend({
	name: "category", // name of the mongodb collection

	// method, that saves picture on folder defined by config.imagePath and then save (insert or edit data)

	saveCategory:function(req,res,next,save_method){

		var self=this;
			fields={},
			busboy = new Busboy({ headers: req.headers });

		busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

			var ext=path.extname(filename),
			fname=path.basename(filename,ext);

			fname=fname+new Date().getTime()+ext;

			if(filename) {
				fields[fieldname] = fname;

				// remove old picture if exists (only for edit)
				if (save_method == 'edit')
					self.removePicture(req, res, next);
			}

			var fullImagePath=path.dirname(require.main.filename)+config.imagePath+fname;

			// save picture
			file.pipe(fs.createWriteStream(fullImagePath));
		});

		busboy.on('field', function(fieldname, val) {
			fields[fieldname] = val; // collect fields from post
		});

		busboy.on('finish', function() {
			console.log('Upload complete');
			req.body.fields=fields;
			self[save_method](req,res,next); // when we finish parsing the request and collecting data, we can save it (insert or edit)
			res.writeHead(200, { 'Connection': 'close' });
			res.end("all");
		});

		return req.pipe(busboy);

	},

	// method that removes picture
	removePicture:function(req,res,next,remove_method){
		var collection=this.name;
		var self=this;
		model.setDB(req.db);
		model.collection(collection).findById(req.params.id,'picture',function(err, data){

			if (!data||err) return next(new Error(collection+' not found'));

			var fullImagePath=path.dirname(require.main.filename)+config.imagePath+data.picture;

			if(fs.existsSync(fullImagePath))
				fs.unlinkSync(fullImagePath);

			if(remove_method)
				self[remove_method](req,res,next);
		});

	},
	editCategory:function(req,res,next){
		return this.saveCategory(req,res,next,'edit');

	},
	insertCategory:function(req,res,next){
		return this.saveCategory(req,res,next,'insert');
	},
	deleteCategory:function(req,res,next){
		return this.removePicture(req,res,next,'delete');
	}
});
