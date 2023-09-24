// src/extensions/users-permissions/strapi-server.js

'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const utils = require('@strapi/utils');

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

// validation
const { yup, validateYupSchema } = require('@strapi/utils');
const registerBodySchema = yup.object().shape({
  email: yup.string().email().required(),
  phoneNumber: yup.string().required(),
});

const validateRegisterBody = validateYupSchema(registerBodySchema);

module.exports = (plugin) => {
  // JWT issuer
  const issue = (payload, jwtOptions = {}) => {
    _.defaults(jwtOptions, strapi.config.get('plugin.users-permissions.jwt'));
    return jwt.sign(
      _.clone(payload.toJSON ? payload.toJSON() : payload),
      strapi.config.get('plugin.users-permissions.jwtSecret'),
      jwtOptions
    );
  };

  //   Register controller override
  plugin.controllers.auth.register = async (ctx) => {
    const pluginStore = await strapi.store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    const params = {
      ..._.omit(ctx.request.body, [
        'confirmed',
        'confirmationToken',
        'resetPasswordToken',
      ]),
      provider: 'local',
    };

    await validateRegisterBody(params);
    
    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email);

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      throw new ValidationError('Please provide a valid email address');
    }

    params.role = role.id;

    let user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email: params.email,phoneNumber: params.phoneNumber },
    });
    console.log('user data', user);
    if (user && user.provider === params.provider) {
      const jwt = issue(_.pick(user, ['id']));
      const sanitizedUser = await sanitizeUser(user, ctx);
      return ctx.send({
        jwt,
        user: sanitizedUser,
        gupta: 1,
      });
    }
    let userEmail = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email: params.email },
    });
    let userPhone = await strapi.query('plugin::users-permissions.user').findOne({
      where: { phoneNumber: params.phoneNumber },
    });
    if (user==null && userEmail && userEmail.provider === params.provider) {
      throw new ApplicationError('Email already taken');
    }
    if (user==null && userPhone && userPhone.provider === params.provider) {
      throw new ApplicationError('Phone Number already taken');
    }

    try {
      if (!settings.email_confirmation) {
        params.confirmed = true;
      }

       user = await strapi
        .query('plugin::users-permissions.user')
        .create({ data: params });

      const sanitizedUser = await sanitizeUser(user, ctx);
      console.log('user data', user);

      if (settings.email_confirmation) {
        try {
          await strapi
            .service('plugin::users-permissions.user')
            .sendConfirmationEmail(sanitizedUser);
        } catch (err) {
          throw new ApplicationError(err.message);
        }

        return ctx.send({ user: sanitizedUser });
      }

      const jwt = issue(_.pick(user, ['id']));

      return ctx.send({
        jwt,
        user: sanitizedUser,
        gupta: 1,
      });
    } catch (err) {
      console.log(err.message);
      throw new ApplicationError(err.message);
    }
  };

  plugin.routes['content-api'].routes.unshift({
    method: 'POST',
    path: '/auth/local/register',
    handler: 'auth.register',
    config: {
      middlewares: ['plugin::users-permissions.rateLimit'],
      prefix: '',
    },
  });

  return plugin;
};