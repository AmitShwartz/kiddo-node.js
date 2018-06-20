const bodyParser = require('body-parser'),
	  express    = require('express'),                      
	  router 	 = express.Router(),
      Task       = require('../models/task')
	  User       = require('../models/user');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//////////// create new task \\\\\\\\\\\\\\\ 
router.post('/new_task/', (req, res) =>{
    let now = new Date(),
    due = new Date(req.body.submission);
//check if the submmision date is possible
    if(now < due){
        var newTask = new Task(req.body);
///save the new task in DataBase
        newTask.save((err) => {
        if(err)
          res.status(500).send({ "Message": `query error: ${err}`});
        else
          res.status(200).json(newTask);   
        });
    }else
       res.status(500).send( `Date of submission is not possible today's Date is ${now.toDateString()}`); 
});

//////////// update user with task \\\\\\\\\\\\\\\ 
router.put('/update_department/:department/:_id_task', (req, res) =>{ 
    var newTaskState = { '_id_task':req.params._id_task };           
    User.update(
        {department: req.params.department},
        {$push:{taskList: newTaskState}},
        {multi: true},
        (err) => {
            if(err)
                res.status(500).send({ "Message": `query error: ${err}`});
            else
                res.status(200).send({"Message":`updated users in department of: ${req.params.department}`});  
        }
    );
}); 

//////// change the date submission of task by Topic \\\\\\\\\\
router.put('/change_submmision/:_id/:submission', (req,res) => {
	let now = new Date(),
        due = new Date(req.params.submission);
//check if the submmision date is possible
    if(now < due){
	    Task.update(
	        {'_id': req.params._id},
	        { $set: {'submission': req.params.submission}}, 
	        {multi: false},
	            (err, task) => {
	                if(err)
	                    res.status(500).send({ "Message": `query error: ${err}`});
	                else
	                    res.status(200).json(task);  
	            }
	    );
    }else
        res.status(500).send( `Date of submission is not possible today's Date is ${now.toDateString()}`);
});


module.exports = router;