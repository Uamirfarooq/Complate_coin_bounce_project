const express = require ('express')
const authcontroller = require('../controller/authcontroller')
const router = express.Router()
const auth = require("../middlewares/auth")
const blogController = require('../controller/blogController')
const commentController = require('../controller/commentController')

// test
// router.get('/test', (req,res)=>{
//     res.json({msg:'woking'})
// });

//user

//register
router.post('/register',authcontroller.register)
//login
router.post('/login',authcontroller.login)
//logout
router.post("/logout",auth , authcontroller.logout)
//refresh
router.get('/refresh',authcontroller.refresh)
//blog

//create
router.post("/blog",auth,blogController.create)
//get all
router.get("/blog/all",auth,blogController.getAll)

//get blog by id
router.get("/blog/:id",auth,blogController.getById)

//update
router.put("/blog",auth,blogController.update)

//delete
router.delete("/blog/:id",auth,blogController.delete)



//comment
//create comment
router.post('/comment', auth ,commentController.create);

router.get('/comment/:id', auth, commentController.getById);
//read comments by blog id
module.exports= router;