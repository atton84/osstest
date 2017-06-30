var _ = require('underscore');
var model = new (require("../../models/Base"));
var S = require('string');
var logger = require("../../utils/logger");

module.exports = {
  name: "base",
  extend: function(child) {
    return _.extend({}, this, child);
  },
    // default method to output index layout
  run: function(req, res, next) {
    res.render('index', {page:{title:'Test',meta_keywords:'Test',meta_description:'Test'}});
  },
    // base method to get list of elements to fill grid
  list:function(req, res, next){

      var collection=this.name;
      model.setDB(req.db);

      var params={};
      params.filters={};
      params.skip=(req.body.pageNumber-1)*req.body.pageSize;
      params.limit=req.body.pageSize;
      params.sort=/*req.body.sortInfo*/{_id:-1};

      for(var i in req.body.filters)
        params.filters[i]=new RegExp(req.body.filters[i],'i');

      if(!_.isEmpty(req.body.sortInfo)){
        params.sort={};
        params.sort=req.body.sortInfo;
      }

      model.collection(collection).find(params.filters)/*.select(params.select).sort(params.sort)*/.skip(params.skip).limit(params.limit).exec(function(err, data){
        if (!data||err) return next(new Error(collection+' not found'));
        model.collection(collection).count(params.filters, function( err, count){
          if (err) return next(err);

          res.send(JSON.stringify({items:data,totalItems:count,filters:/*req.body.filters*/params.filters,skip:params.skip,limit:params.limit}));
        });

      });
  },
    // base method for edit
  edit:function(req,res,next){
    model.setDB(req.db);

    model.collection(this.name).findByIdAndUpdate(req.params.id, req.body.fields, {upsert:false}, function(err, doc){
      if (err) return next(err);
      return res.send("succesfully saved");
    });
  },
    // base method for delete
  delete:function(req,res,next){
    model.setDB(req.db);

    model.collection(this.name).findByIdAndRemove(req.params.id, {}, function(err, doc){
      if (err) return next(err);
      return res.send("succesfully saved");
    });
  },
    // base method for insert
  insert:function(req,res,next){
    model.setDB(req.db);

    model.collection(this.name).create(req.body.fields, function(err, doc){
      if (err) return next(err);
      return res.send("succesfully saved");
    });

  }

};