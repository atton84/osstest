
// here we can store scemas for mongodb
module.exports = function(db) {
  this.db = db;
  this._schema={
      category:{
        category:{type:String},
        title:{type:String},
        description:{type:String},
        picture:{type:String},
      }
  };
};

// some methods that makes work with db more easy
module.exports.prototype = {
  _collection:[],
	extend: function(properties) {
		var Child = module.exports;
		Child.prototype = module.exports.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
	setDB: function(db) {
		this.db = db;
	},
  getSchema: function(name){
    if(this._schema[name]) return this._schema[name];
  },
    collection: function(name) {
        if(this._collection[name])
            return this._collection[name];

        return this._collection[name] = this.db.model(name,new this.db.Schema(this.getSchema(name),{versionKey:false}),name);
    }

}
