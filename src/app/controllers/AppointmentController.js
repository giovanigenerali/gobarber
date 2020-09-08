const { User, Appointment } = require("../models");

class AppointmentController {
  async create(req, res) {
    const provider = await User.findByPk(req.params.provider);

    return res.render("appointments/create", {
      provider,
    });
  }

  async store(req, res) {
    const { id } = req.session.user;
    const { provider } = req.params;
    const { date } = req.body;

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date,
    });

    return res.redirect("/app/schedule");
  }

  async remove(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    appointment.destroy();

    return res.json({
      status: true,
    });
  }
}

module.exports = new AppointmentController();
