const bodyParser = require('body-parser'),
	  express    = require('express'),                      
	  router 	 = express.Router(),
	  Task  	 = require('../models/task'),
	  User  	 = require('../models/user');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

////////// create new user \\\\\\\\\\
router.post('/new_user/', (req, res) =>{ 
        var newUser = new User(req.body);
///save the new user in DataBase
        newUser.save((err) => {
            if(err)
                res.status(500).send({ "Message": `query error: ${err}`});
            else{
                res.status(200).json(newUser);
            }
        });    
});

//////////// calculate the grade with date of finish \\\\\\\\\\\\ 
//0.4 from finish time 0.6 from grade
router.put('/calculate_rank/:email/:task_id/:grade',(req, res) =>{
  if((req.params.grade<101)&&(req.params.grade>0))
        {
          User.aggregate([
                     {$match:{email:req.params.email}},
                     {$project: {
                            "taskList": {
                                $filter: {
                                    input: "$taskList",
                                    as: "task",
                                    cond: { 
                                        $eq: [ "$$task._id_task", req.params.task_id ]
                                    }
                                }
                            }
                        }
                     }          
               ],(err,user) => {
                 if(err)
                   res.status(500).send({ "Message": `query error: ${err}`});
                 
                 Task.findOne({_id:req.params.task_id},(err1,task) => {
                    if(err1)
                      res.status(500).send({ "Message": `query error: ${err1}`});
         
                     var timeDiff = Math.abs(task.submission.getTime() - user[0].taskList[0].given_date.getTime());
                     var s_delta = Math.ceil(timeDiff / (1000 * 3600 * 24));  
                     timeDiff = Math.abs(user[0].taskList[0].finish_date.getTime() - user[0].taskList[0].given_date.getTime());
                     var f_delta = Math.ceil(timeDiff / (1000 * 3600 * 24));
                     var result =  Math.ceil(((s_delta - f_delta) / s_delta * 40)+req.params.grade * 0.6);
         
                     User.update({ email:req.params.email },
                         { $inc:{rank: result}},
                         {multi: false},
                         (err2) => {
                               if(err2)
                                   res.status(500).send({ "Message": `query error: ${err2}`});
                               else
                                   res.status(200).send( {"Message": 'rank updated'});  
                       });
                   });
                 }
             );
    }else
        res.status(500).send({ "Message": `query error: grade out of bounds`});
});

//////// update the status of task by taskState _id , to Completed \\\\\\\\\\
router.put('/task_complete/:t_state_id', (req,res) => {
    User.update(
        {'taskList._id': req.params.t_state_id},
        { $set: {'taskList.$.status': "Completed",'taskList.$.finish_date': new Date() }}, 
        {multi: false},
            (err, user) => {
                if(err)
                    res.status(500).send({ "Message": `query error: ${err}`});
                else
                    res.status(200).json(user);  
            }
    );
});


//////////////// add helper to specific task \\\\\\\\\\\\\\\\
router.put('/add_helper/:task_id/:user_id/:helper_id', (req,res) => {
    User.update(
        {'_id': req.params.user_id, 'taskList._id_task':req.params.task_id},
        { $push: {'taskList.$.helper_id': req.params.helper_id}}, 
        {multi: false},
            (err, user) => {
                if(err)
                    res.status(500).send({ "Message": `query error: ${err}`});
                else
                    res.status(200).json(user);  
            }
    );
});

////////////// delete user \\\\\\\\\\\\\\\\\
router.delete('/delete_user/',(req,res)=>{
    User.remove({email:req.body.Email},
    (err)=>{
        if(err)
            res.status(500).send({ "Message": `query error: ${err}`});
        else{
            console.log(`Removed Document`);
            user.find({email:req.body.Email},
                (err)=>{
                    res.status(200).send(`Removed document by Email: ${req.body.Email}`);
            });
        }
    });
});

////////////// get all users \\\\\\\\\\\\\\\\\\
router.get('/get_all_users/',(req, res) =>{
        User.find({}, (err, users) => {
            if(err)
                res.status(500).send({ "Message": `query error: ${err}`});

            res.status(200).json(users);
        });
});

//////////// get user by email \\\\\\\\\\\\\\\\
router.get('/get_user_by_email/:email', (req, res) => {
        User.findOne({email: req.params.email}, (err, user) => {
            if(err)
                res.status(500).send({ "Message": `query error: ${err}`});

            res.status(200).json(user);
        });
});

///////// get all users that completed the task \\\\\\\\\\\\ 
router.get('/users_complete/:_id_task',(req, res) =>{
    User.find({taskList: {'$elemMatch' : {
	        	                '_id_task' : req.params._id_task,
	        	                'status': "Completed"
	        	                }
	        	            }
	        	        }
           		, (err, users) => {
                        if(err)
                          res.status(500).send({ "Message": `query error: ${err}`});

                        res.status(200).json(users);
                    }
            );
});

///////// get all users that not completed the task \\\\\\\\\\\\ 
router.get('/users_not_complete/:_id_task',(req, res) =>{
    User.find({taskList: {'$elemMatch' : {
                            '_id_task' : req.params._id_task,
                            'status': "not complete"
                            }
                        }
                    }
              , (err, users) => {
                        if(err)
                          res.status(500).send({ "Message": `query error: ${err}`});

                        res.status(200).json(users);
                    }
            );
});

module.exports = router;

