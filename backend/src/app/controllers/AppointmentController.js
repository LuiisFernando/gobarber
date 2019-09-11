import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                provider_id: Yup.number().required(),
                date: Yup.date().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Validation fails' });
            }

            const { provider_id, date } = req.body;

            // check if provider_id is a provider
            const isProvider = await User.findOne({
                where: { id: provider_id, provider: true },
            });

            if (!isProvider) {
                return res.status(401).json({
                    error: 'You can only create appoitments with providers',
                });
            }

            const appoitment = await Appointment.create({
                user_id: req.userId,
                provider_id,
                date,
            });

            return res.json(appoitment);
        } catch (err) {
            return res.json(err);
        }
    }
}

export default new AppointmentController();
