const bodyParser  	  = require('body-parser'),
	  express         = require('express'),        
	  app    		  = express(),
	  database    	  = require('./database/database'),
	  userCtl 	 	  = require('./controllers/user.ctl'), 
	  coordinatorCtl  = require('./controllers/coordinator.ctl'),  				               
	  port 		 	  = process.env.PORT || 3000;      // set our port
      
      
app.set('port',port); 
app.use('/', express.static('./public'));//for API 
app.use(   (req,res,next) => {    
res.header("Access-Control-Allow-Origin", "*");    
res.header("Access-Control-Allow-Headers",                
            "Origin, X-Requested-With, Content-Type, Accept");    
      //res.set("Content-Type", "application/json");    
      next();  
    });
app.use('/coordinator',coordinatorCtl);
app.use('/user',userCtl);

app.get('/' ,
    (req,res) =>{
    res.sendFile(`${__dirname}/index.html`);
    });

app.get('/includes/style.css',
    (req,res) =>{
    res.sendFile(`${__dirname}/includes/style.css`);
    });

app.all('*', (req, res) => {
    res.status(404).send('wrong route');
}); 

// start server
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});