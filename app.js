const express = require('express');
const mongoose = require('mongoose');
const errorhandler = require('errorhandler');
const logger= require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const recipe = require("./schem");
const app = express();
app.use(logger('dev'))
app.use(errorhandler())

// middleware
app.use(express.json());



const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "recipe API",
        version: '1.0.0',
      },
    },
    apis: ["app.js"],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  
  


// database connection
const dbURI = 'mongodb+srv://user123:test123@cluster0.uun1m.mongodb.net/recipe-data';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


   /**
   * @swagger
   * /findall:
   *   get:
   *     summary: get all recipes from database
   *     description: Get all recipes
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: NOT found
   * 
   */

  app.get('/findall', function(req, res) {
    recipe.find(function(err, data) {
        if(err){
            console.log(err);
            res.status(400).json({"error":message});
        }
        else{
            res.status(200).send(data);
        }
    });  
 });

/**
 * @swagger
 * /save/:
 *  post:
 *   summary: add recipe to database
 *   description: add recipe to database 
 *   parameters:
 *    - in: body
 *      name: body
 *      require: true
 *      schema:
 *       type: object
 *       properties:
 *          title:
 *               type: string
 *               description:  title of the recipe.
 *               example: Thai pizza
 *          image:
 *               type: string
 *               description: recipe image url
 *               example: https://spoonacular.com/recipeImages/663136-312x231.jpg
 *          ingredients:
 *               type: array
 *               description: recipe ingredents
 *               example: ["fresh pizza dough","mixed greens","onion", "diced butternut squash"]
 *          instructions:
 *               type: array
 *               description: The recipe instructions
 *               example: [the recipe instructions]
 *          nutrition:
 *               type: object
 *               decription: add nutrients.
 *               example: {nutrients: [{title: ["Calories"],amount: [923],unit: ["kcal"]}]}
 *   responses:
 *    201:
 *     description: success new recipe added to database
 *    400:
 *     description: check deatils and try again
 */

 app.post('/save/', function(req, res) {
    let newrecpie = new recipe();
       newrecpie.title= req.body.title;
       newrecpie.image= req.body.image;
       newrecpie.ingredients= req.body.ingredients;
       newrecpie.instructions= req.body.instructions;
       newrecpie.nutrition= req.body.nutrition;
      
       try{
       newrecpie.save(function(err, data){
           if(err){
               console.log(err);
               res.status(400).json({"error":err});
           }
           else{
               res.status(201).send("Data inserted");
           }
       });

    } catch (err){
            res.status(400).send(err)
    }

    });


/**
 * @swagger
 * /update/:
 *  put:
 *   summary: update recipe details
 *   description: update recipe from database 
 *   parameters:
 *    - in: body
 *      name: body
 *      require: true
 *      schema:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: The id of recipe.
 *              example: 1234
 *          title:
 *              type: string
 *              description: The title of recipe
 *              example: pizza
 *          instructions:
 *              type: array
 *              description: The recipe instructions
 *              example: [the recipe instructions]
 *   responses:
 *    201:
 *     description: success
 *    400:
 *     description: check id
 *    404:
 *     description: NOT FOUND
 */
    app.put('/update/', function(req, res) {
        //A.findByIdAndUpdate(id, update, callback) // executes
        let id = req.body.id ;
        recipe.findByIdAndUpdate(id, 
        {title:req.body.title,instructions:req.body.instructions}, function(err, data) {
            if(err){
                console.log(err);
                res.status(400).json({"error":err});
            }
            else{
    
                    res.status(200).send("data updated");
                console.log("Data updated!");
               
            }
        });  
    });




 /**
 * @swagger
 * /delete/:
 *  delete:
 *   summary: delete recipe from database
 *   description: delete recipe from database 
 *   parameters:
 *    - in: body
 *      name: body
 *      require: true
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         description: delete the recipe from database.
 *         example:  "608bdce7d571b6090074faae"
 *   responses:
 *    200:
 *     description: success data deleted
 *    400:
 *     description: check Id
 *    404:
 *     description: no content found check id 
 */
 


    app.delete('/delete/', function(req, res) {
        //A.findByIdAndRemove(id, callback)
        const id = req.body.id;
        recipe.findByIdAndRemove(id, 
        function(err, data) {
            if(err){
                console.log(err);
                res.status(400).json({"error":err});
            }
            else{
            
                    res.status(200).send("data deleted");
                console.log("Data Deleted!");
               
               
                
            }
        });  
    });



/** 
  // Create a record
// https://mongoosejs.com/docs/models.html#constructing-documents
const recp = new recipe({
    
        title: "Butternut Squash Pizza"
        ,
        image:"https://spoonacular.com/recipeImages/636593-312x231.jpg"
        ,
        ingredients: ["fresh pizza dough","mixed greens","onion", "diced butternut squash"],
        instructions:["Preheat oven to highest internal temperature"],
        nutrition: {
          nutrients: [
              {
                  title: ["Calories"],
                  amount: [923],
                  unit: ["kcal"]
              }
          ]
      }
       
      
      
});

recp.save(function (err) {
    if (err) return err;
    // saved!
  });
*/