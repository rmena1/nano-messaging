const jRouter = require('koa-joi-router');
const index = require('./routes/index');
const rooms = require('./routes/rooms');
const messages = require('./routes/messages');

const router = jRouter();

router.use('/test', index.middleware());
router.use('/rooms', rooms.middleware());
router.use('/messages', messages.middleware());

module.exports = router;
