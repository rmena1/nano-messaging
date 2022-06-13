const jRouter = require('koa-joi-router');

const { Joi } = jRouter;
const { Op } = require('sequelize');

const router = jRouter();

async function authorizeRoomAdmin(ctx, next) {
  const room = await ctx.orm.Room.findByPk(ctx.params.id);
  if (!room) {
    return ctx.throw(404);
  }
  let authorized = false;
  if (room.entity_owner === ctx.state.tokendata.entityUUID
    && room.level_admin <= ctx.state.tokendata.levelOnEntity) {
    authorized = true;
  } else {
    const roomPermission = await ctx.orm.Room_permission.findAll({
      where: {
        room_id: room.id,
        entity_UUID: { [Op.in]: [ctx.state.tokendata.userUUID] },
      },
    });
    if (roomPermission.some((element) => element.permissions.indexOf('a') > -1)) {
      authorized = true;
      ctx.request.room_permission = roomPermission;
    }
  }
  if (authorized) {
    ctx.request.room = room;
    return next();
  }
  return ctx.throw(403);
}

async function authorizeRoom(ctx, next, permission) {
  const room = await ctx.orm.Room.findByPk(ctx.params.id);
  if (!room) {
    return ctx.throw(404);
  }
  let authorized = false;
  // Is this an admin of the place directly on the room (via his level at the parent entity)
  if (room.entity_owner === ctx.state.tokendata.entityUUID
    && room.level_admin <= ctx.state.tokendata.levelOnEntity) {
    authorized = true;
  } else {
    // Check directly of permissions over the room as user
    const roomPermission = await ctx.orm.Room_permission.findAll({
      where: {
        room_id: room.id,
        entity_UUID: ctx.state.tokendata.userUUID,
      },
    });
    if (roomPermission.some((element) => element.permissions.indexOf(permission) > -1)) {
      authorized = true;
      ctx.request.room_permission = roomPermission;
    }
  }
  if (authorized) {
    ctx.request.room = room;
    return next();
  }
  return ctx.throw(403);
}

// Get rooms for my entity based on uuid
router.route({
  method: 'GET',
  path: '/',
  validate: {
    query: {
      limit: Joi.number(),
      offset: Joi.number(),
      accepted: Joi.boolean(),
    },
  },
  handler: async (ctx) => {
    const rooms = await ctx.orm.Room_permission.findAll({
      where: {
        entity_UUID: ctx.state.tokendata.userUUID,
        accepted: ctx.request.query.accepted,
      },
      limit: ctx.request.query.limit,
      offset: ctx.request.query.offset,
    });
    ctx.status = 200;
    ctx.response.json = rooms;
  },
});

// Creates invitation for a new member.
router.route({
  method: 'PUT',
  path: '/:id/invitation',
  validate: {
    type: 'json',
    params: {
      id: Joi.number(),
    },
    body: {
      use_parent_entity: Joi.boolean(),
      accepted: Joi.boolean(),
    },
  },
  handler: async (ctx) => {
    let target_min_level = 0;
    let target_entity = '';
    if (ctx.request.body.use_parent_entity) {
      // User represents an organization and tries to accept this
      target_entity = ctx.state.tokendata.entityUUID;
      target_min_level = ctx.state.tokendata.levelOnEntity;
    } else {
      // User is modifying his own permissions to accept them
      target_entity = ctx.state.tokendata.userUUID;
      target_min_level = 0;
    }
    const target_rule = await ctx.orm.Room_permission.findOne({
      where: {
        room_id: ctx.params.id,
        entity_UUID: target_entity,
        level: { [Op.gte]: target_min_level },
      },
    });
    target_rule.accepted = ctx.request.body.accepted;
    await target_rule.save();
    ctx.response.json = target_rule;
  },
});

// Create room
router.route({
  method: 'POST',
  path: '/',
  validate: {
    type: 'json',
    body: {
      name: Joi.string().max(30),
      level_admin: Joi.number().max(1000),
      type: Joi.string().valid('group', 'user2user'),
    },
  },
  pre: async (ctx, next) => {
    if (ctx.state.tokendata.levelOnEntity < 100) {
      ctx.throw(403);
    }
    return next();
  },
  handler: async (ctx) => {
    const roomJson = ctx.request.body;
    roomJson.entity_owner = ctx.state.tokendata.entityUUID;
    const room = await ctx.orm.Room.create(roomJson);
    const baseUserPermission = {
      room_id: room.id,
      entity_UUID: ctx.state.tokendata.userUUID,
      level: ctx.state.tokendata.levelOnEntity,
      permissions: 'rwa',
    };
    const baseEntityPermission = {
      room_id: room.id,
      entity_UUID: ctx.state.tokendata.entityUUID,
      level: 100,
      permissions: 'rw',
    };
    await ctx.orm.Room_permission.create(baseUserPermission);
    await ctx.orm.Room_permission.create(baseEntityPermission);
    ctx.response.json = { room };
    ctx.status = 200;
  },
});
// Remove room (not implemented)
router.route({
  method: 'DELETE',
  path: '/:id',
  pre: authorizeRoomAdmin,
  handler: async (ctx) => {
    await ctx.request.room.destroy();
    ctx.status = 200;
  },
});

// affiliate other entities to room via permissions
/*
 * Permissions available
 *  It must be on the rwba format
 * r = read
 * w = write
 * b = banned
 * a = admin
 */
router.route({
  method: 'PUT',
  path: '/:id/members',
  validate: {
    type: 'json',
    params: {
      id: Joi.number(),
    },
    body: {
      entity_UUID: Joi.string().guid(),
      permissions: Joi.string().max(5),
      level: Joi.number(),
    },
  },
  pre: authorizeRoomAdmin,
  handler: async (ctx) => {
    const nrules = await ctx.orm.Room_permission.count({
      where: {
        room_id: {
          [Op.eq]: ctx.request.room.id,
        },
      },
    });
    if (nrules <= 10) {
      const rule = {
        room_id: ctx.request.room.id,
        entity_UUID: ctx.request.body.entity_UUID,
        level: ctx.request.body.level,
        permissions: ctx.request.body.permissions,
      };
      try {
        ctx.status = 201;
        ctx.response.json = await ctx.orm.Room_permission.create(rule);
      } catch (error) {
        ctx.response.meta.reason = error.parent.detail;
        ctx.throw(400);
      }
    } else {
      ctx.response.meta.reason = 'TOO_MANY_RULES';
      ctx.throw(403);
    }
  },
});

// remove from room via rule deletion
router.route({
  method: 'DELETE',
  path: '/:id/members/:entityUUID',
  validate: {
    type: 'json',
    params: {
      id: Joi.number(),
      entityUUID: Joi.string().guid(),
    },
  },
  pre: authorizeRoomAdmin,
  handler: async (ctx) => {
    const targetRule = await ctx.orm.Room_permission.findOne({
      where: {
        room_id: ctx.params.id,
        entity_UUID: ctx.params.entityUUID,
      },
    });
    if (targetRule) {
      await targetRule.destroy();
      ctx.status = 200;
    } else {
      ctx.throw(404);
    }
  },
});

// Messages from room
router.route({
  method: 'GET',
  path: '/:id/messages',
  validate: {
    params: {
      id: Joi.number(),
    },
    query: {
      dateFrom: Joi.date().iso(),
      dateTo: Joi.date().iso().max('now').min(Joi.ref('dateFrom')),
    },
  },
  pre: async (ctx, next) => authorizeRoom(ctx, next, 'r'),
  handler: async (ctx) => {
    ctx.response.json = await ctx.orm.Message.findAll({
      where: {
        room_id: ctx.params.id,
        createdAt: {
          [Op.between]: [ctx.query.dateFrom, ctx.query.dateTo],
        },
      },
    });
    ctx.status = 200;
  },
});

module.exports = router;
