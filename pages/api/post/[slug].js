import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()
  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const { slug } = req.query;
    const post = await models.posts.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['createdAt', 'ASC'],
      ],
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: post });
  })
  // Post method
  .post(async (req, res) => {
    const { body } = req;
    const { title, content } = body;
    const { user } = req;
    const newPost = await models.posts.create({
      title,
      content,
      status: 1,
      userId: user.id,
    });
    return res.status(200).json({
      status: 'success',
      message: 'done',
      data: newPost,
    });
  })  
  .delete (async (req, res)=>{
    const {slug:id} = req.query;
    const user = req.user;
    const deletePost = await models.posts.destroy({
      where : {id:id , userId: user.id} 
    })    
    return res.status(200).json({
      data: deletePost,  
    })
  })

  // Put method
  .put(async (req, res) => {
    const user = req.user;
    const { slug } = req.query;
    const id = slug;
    if (user) {
      await models.posts.update(req.body, {where: { id: id , userId: user.id }
      })
    
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: 'done',
          status: 'success'
        });
      } else {
        res.status(401).send({
          message: 'Cannot update post with id=${id}. Maybe Job was not found or you are not de owner!',
          status: 'error',
          
        });
      }
      })
    }
  })
  
  
      
      
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  })

export default handler;
