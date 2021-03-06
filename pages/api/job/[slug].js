import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()
  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const {
      query: { slug },
      method,
      body,
    } = req;
    const job = await models.jobs.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: job });
  })
  // Post method
  .post(async (req, res) => {    
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, content, emailTo, reportManager, dateLimit } = body;
    const { slug } = req.query;
    const { user } = req;
    let status = 'success',
      statusCode = 200,
      error = '',
      newJob = {};

    try {
      newJob = await models.jobs.create({
        title,
        content,
        emailTo,
        reportManager,
        dateLimit,
        status: 1,
        userId: user.id,
      });

    } catch (err) {
      /* Sql error number */
      statusCode = 500;
      error = err.original.errno && 'Not available right now';
      status = 'error';
    } 

    return res.status(statusCode).json({
      status,
      error,
      message: 'done',
      data: newJob,
    });
  })
  .delete (async (req, res  )=>{
    const {slug:id} = req.query;
    const deleteJobs = await models.jobs.destroy({
      where : {id} 
    })
    return res.status(200).json({
      message: 'done',
      status: 'success',
      data: deleteJobs,  
    })
  })
 
  // Put method
  .put(async (req, res) => {
    const user = req.user;
    const { slug } = req.query;
    const id = slug;
    if (user) {
      await models.jobs.update(req.body, {where: { id: id , userId: user.id }
      })
    
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: 'done',
          status: 'success'
        });
      } else {
        res.status(401).send({
          message: 'Cannot update jobs with id=${id}. Maybe Job was not found or you are not de owner!',
          status: 'error',
          
        });
      }
      })
    }
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
