import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

class AppointmentController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const appoitments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            limit: 20,
            offset: (page - 1) * 20,
            attributes: ['id', 'date'],
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });

        return res.json(appoitments);
    }

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

            // check for past dates
            const hourStart = startOfHour(parseISO(date));

            // if date informed is before now
            if (isBefore(hourStart, new Date())) {
                return res
                    .status(400)
                    .json({ error: 'Past dates are not permitted.' });
            }

            // check date availability
            const checkAvailability = await Appointment.findOne({
                where: {
                    provider_id,
                    canceled_at: null,
                    date: hourStart,
                },
            });

            if (checkAvailability) {
                return res
                    .status(400)
                    .json({ error: 'Appointment date is not available' });
            }

            const appoitment = await Appointment.create({
                user_id: req.userId,
                provider_id,
                date,
            });

            // Notify appointment provider

            const user = await User.findByPk(req.userId);
            const formattedFate = format(
                hourStart,
                "'dia' dd 'de' MMMM', às' H:mm'h'",
                { locale: pt }
            );
            await Notification.create({
                content: `Novo agendamento de ${user.name} para ${formattedFate}`,
                user: provider_id,
            });

            return res.json(appoitment);
        } catch (err) {
            return res.json(err);
        }
    }

    async delete(req, res) {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
            ],
        });

        if (appointment.user_id !== req.userId) {
            return res.status(401).json({
                error: "You don't have a permission to cancel this appointment",
            });
        }

        const dateWithSub = subHours(appointment.date, 2);

        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                error: 'You can only cancel appointments 2 hours in advance.',
            });
        }

        appointment.canceled_at = new Date();

        await appointment.save();

        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            text: 'Você tem um novo cancelamento',
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
