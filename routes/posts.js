const router = require("express").Router();
const User = require("../models/User"); 
const Post = require("../models/Post");


//CREATE NEW POST
router.post("/", async (req, res)=> {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    }catch (err) {
      res.status(500).json(err);
    }
  });

//UPDATE POST
router.put("/:id", async (req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username) //Warunek odpowiadający za sprawdzenie czy nazwa użytkownika osoby która chce zaktualizować post jest taka sama jak właściciela postu
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body, //The $set operator replaces the value of a field with the specified value.
                },{ new:true });  //Bez tego funkcja findByIdAndUpdate zwraca dokument przed jego zaktualizowaniem, po dodaniu parametru {new:true} zwracany jest dokument po aktualizacji
  
                res.status(200).json(updatedPost)
            }catch(err) {
                res.status(500).json(err);
        }else {
            res.status(401).json("You can update only your posts")
        }

    }catch(err) {
        res.status(500).json(err);
    }
});

//DELETE POST
router.delete("/:id", async (req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username) //Warunek odpowiadający za sprawdzenie czy nazwa użytkownika osoby która chce usunąć post jest taka sama jak właściciela postu
            try {
                await post.delete();
                res.status(200).json("Post has been deleted")
            }catch(err){
                res.status(500).json(err);
        }else {
            res.status(401).json("You can delete only your posts")
        }

    }catch(err) {
        res.status(500).json(err);
    }
});

//GET POST
router.get("/:id", async(req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err) {
        res.status(500).json(err);
    }
});

//GET ALL POSTS
router.get("/", async(req,res)=> {
    const username = req.query.user; //(??) This property is an object containing a property for each query string parameter in the route. 
    //When query parser is set to disabled, it is an empty object {}, otherwise it is the result of the configured query parser.
    const catName = req.query.cat; 
    try {
        let posts; //Określenie zmiennej pozwalającej na przypisanie różnych wartości w zależności od wyszukiwania po użytkowniku lub po kategorii
        if(username) {
            posts = await Post.find({ username }); //Post.find ({username:username}) to również poprawna wersja, tutaj używamy skróconej
        }else if(catName) {
            posts = await Post.find({ categories: {
                $in:[catName] //The $in operator selects the documents where the value of a field equals any value in the specified array.
            }});
        }else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    }catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;