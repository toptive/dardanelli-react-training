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
    const event = await models.events.findOne({
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
    return res.json({ status: 'success', data: event });
  })
  // Post method
  .post(async (req, res) => {
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, content, emailTo, dateStart, dateEnd } = body;
    const { slug } = req.query;
    const { user } = req;
    let status = 'success',
      statusCode = 200,
      error = '',
      newEvent = {};

    try {
      newEvent = await models.events.create({
        title,
        content,
        emailTo: user.email,
        dateStart,
        dateEnd,
        status: 1,
        userId: user.id,
      });
    } catch (err) {
      /* Sql error number */
      statusCode = 500;
      error = 'Unauthorized';
      status = 'error';
    }

    let userAux = await models.users.findOne({
      where: { id: user.id },
      attributes: ['id', 'email', 'balance'],
      limit: 1,
    });
    if (userAux){
      /* console.log(userAux.balance); */
      const new_balance = userAux.balance - 15;
      /* console.log(new_balance); */
      await models.users.update({balance: new_balance}, {where: { id: user.id }
      })
    }
    return res.status(statusCode).json({
      status,
      error,
      message: 'done',
      data: newEvent,
    });
  })

  // delete method
  .delete (async(req, res) => {
    const user = req.user;
    const { slug } = req.query;
    const id = slug;
    if (user){
      await models.events.destroy({
        where: { id: id , userId: user.id }
      })
        .then(num => {
          if (num == 1) {
            res.send({             
              message: "Event was deleted successfully!"
            });
          } else {
            res.status(401).send({
              message: `Cannot delete Event with id=${id}. Maybe Event was not found or you're not de owner!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Event with id=" + id
          });
        }); 
    }else {
      /* res.send({
        message: `No estas logeado amigo!`
      }); */
      res.status(500)
      return res.json({ status: 'failed'});
    }
  })
  // Put method
  .put(async(req, res) => {
    const user = req.user;
    const { slug } = req.query;
    const id = slug;
    if (user){
      await models.events.update(req.body, {where: { id: id , userId: user.id }
      })
        .then(num => {
          if (num == 1) {
            res.status(200).send({
              message: 'done',
              status: 'success'

            });
          } else {
            res.status(401).send({
              message: `Cannot update Event with id=${id}. Maybe Event was not found or you're not de owner!`,
              status: 'error'
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not update Event with id=" + id,
            status: 'error'
          });
        }); 
    }else {
      res.status(500)
      return res.json({ status: 'failed'});
    }
  })  
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
