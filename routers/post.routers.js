const Router = require("express")
const router = new Router()
const postController = require('../controllers/post.controller')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const jsonParser = bodyParser.json()
const authMiddleware = require('../middlewares/auth.middelewares');
const isActive = require('../middlewares/isActive.middlewares')
const adminCheck = require('../middlewares/adminCheck.middlewares')

router.post('/create',
    urlencodedParser,
    jsonParser,
    authMiddleware,
    isActive,
    postController.addPost
);

router.get('/allposts',
    postController.getPosts
);

router.get('/:id',
    postController.getToUpbatePost
);

router.post('/:id',
    urlencodedParser,
    jsonParser,
    postController.findPost
);

router.post('/like/:id',
    urlencodedParser,
    jsonParser,
    authMiddleware,
    postController.LikePost
);

router.post('/comment/add/:id',
    urlencodedParser,
    jsonParser,
    authMiddleware,
    postController.addComment
);

router.delete('/comment/delete/:id',
    urlencodedParser,
    jsonParser,
    authMiddleware,
    postController.delComment
);

router.put('/update/:id',
    urlencodedParser,
    jsonParser,
    authMiddleware,
    postController.updatePost
);

router.delete('/delete/:id',
    urlencodedParser,
    jsonParser,
    authMiddleware,
    postController.deletePost
);

module.exports = router;