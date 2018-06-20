const consts     = require('./const'),
	  mongoose   = require('mongoose');

mongoose.connect(consts.mlab_key).then(
	() => {
        console.log("Connecting DataBase..")
    },
    err => {
        console.log(`connection error: ${err}`);
  	}
);
