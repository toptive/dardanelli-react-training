import models from '../../db/models/index';
import nextConnect from 'next-connect';
import jwt from 'jsonwebtoken';

const KEY = process.env.JWT_KEY;

const handler = nextConnect()
  
  .post(async (req, res) => {
    /* Get Post Data */
    const MAX = 99999999;
  const MIN = 10000000;
    const { email, googleId, firstName, lastName } = req.body;
    /* Check user in database */
    let user = await models.users.findOne({
      where: { googleId: googleId },
      attributes: ['id', 'email' ],
      limit: 1,
    });
    /* Check if exists */
    if (!user) {
      user = await models.users.create({
        googleId,
        firstName,
        lastName,
        email,
        password: (Math.floor(Math.random) * (MAX - MIN) + MIN).toString(), 
        username: firstName.substring(0,1) + lastName,
        status:1,
      });
    }
    /* Define variables */
    const dataUser = user.toJSON();
    const userId = dataUser.id,
      userEmail = dataUser.email,
      userPassword = dataUser.password;
        /* User matched */
        /* Create JWT Payload */
        const payload = {
          id: userId,
          email: userEmail,
        };
        /* Sign token */
        jwt.sign(
          payload,
          KEY,
          {
            expiresIn: 31556926, // 1 year
          },
          (err, token) => {
            res.status(200).json({
              success: true,
              token: 'Bearer ' + token,
            });
          },
        );
  });
export default handler;