const { Appointment, User } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

class ScheduleController {
  async index(req, res) {
    let condition = {
      include: [
        {
          attributes: ["id", "name", "avatar"],
          model: User,
          as: "user",
        },
        {
          attributes: ["id", "name", "avatar"],
          model: User,
          as: "provider",
        },
      ],
      where: {
        date: {
          [Op.gte]: [moment().startOf("day").format()],
        },
      },
    };

    if (req.session.user.provider === true) {
      condition.where = {
        provider_id: req.session.user.id,
      };
    } else {
      condition.where = {
        user_id: req.session.user.id,
      };
    }

    const appointments = await Appointment.findAll(condition);

    return res.render("schedule/index", {
      appointments: appointments.map((a) => {
        return {
          id: a.id,
          date: moment(a.date).format("YYYY/MM/DD HH:mm"),
          provider: a.provider,
          user: a.user,
        };
      }),
    });
  }
}

module.exports = new ScheduleController();
