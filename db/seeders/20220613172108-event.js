'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    var now = new Date();
    return queryInterface.bulkInsert('events', [
      {
        userId: 1,
        title: 'event Title One',
        slug: 'event-title-one',
        content: 'Text content event one',
        emailTo: 'email1@email.com',
        dateStart: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        dateEnd: new Date(now.getFullYear(), now.getMonth() + 4, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'event Title two',
        slug: 'event-title-two',
        content: 'Text content event two',
        emailTo: 'email1@email.com',
        dateStart: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        dateEnd: new Date(now.getFullYear(), now.getMonth() + 4, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: 'event Title three',
        slug: 'event-title-three',
        content: 'Text content event three',
        emailTo: 'email1@email.com',
        dateStart: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        dateEnd: new Date(now.getFullYear(), now.getMonth() + 4, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        title: 'event Title four',
        slug: 'event-title-four',
        content: 'Text content event four',
        emailTo: 'email1@email.com',
        dateStart: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        dateEnd: new Date(now.getFullYear(), now.getMonth() + 4, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        title: 'event Title five',
        slug: 'event-title-five',
        content: 'Text content event five',
        emailTo: 'email1@email.com',
        dateStart: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        dateEnd: new Date(now.getFullYear(), now.getMonth() + 4, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  },
};
