import MailerService from './MailerService';
import ModelFactory from '../../test/ModelFactory';
import User from '../models/User';

describe('MailerService', () => {
  beforeAll(() => {
    process.env.SMTP_FROM_NAME = 'Sokown';
    process.env.SMTP_FROM_ADDRESS = 'noreply@sokown.test';
  });

  describe('sendMailNotification', () => {
    it('sends email with correct subject and recipient', async () => {
      // given
      const sendMailMock = jest.fn().mockResolvedValue({ messageId: '123' });
      const transporterMock = { sendMail: sendMailMock };
      const mailerService = new MailerService(transporterMock as any);

      const owner = new User(1, 'Test Pilot', 'pilot@example.com', true);
      const ship = ModelFactory.createShip({
        name: 'Artemis',
        owner,
      });
      const location = ModelFactory.createLocation({ name: 'Mars' });

      // when
      await mailerService.sendMailNotification(ship, location);

      // then
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'pilot@example.com',
          subject: 'Artemis has arrived at Mars',
        }),
      );
    });

    it('includes ship and location info in email body', async () => {
      // given
      const sendMailMock = jest.fn().mockResolvedValue({ messageId: '123' });
      const transporterMock = { sendMail: sendMailMock };
      const mailerService = new MailerService(transporterMock as any);

      const owner = new User(1, 'Test Pilot', 'pilot@example.com', true);
      const ship = ModelFactory.createShip({
        id: 42,
        name: 'Discovery',
        owner,
      });
      const location = ModelFactory.createLocation({ name: 'Jupiter' });

      // when
      await mailerService.sendMailNotification(ship, location);

      // then
      const callArgs = sendMailMock.mock.calls[0][0];
      expect(callArgs.text).toContain('Discovery');
      expect(callArgs.text).toContain('Jupiter');
      expect(callArgs.text).toContain('http://localhost:4200/ships/42');
      expect(callArgs.html).toContain('Discovery');
      expect(callArgs.html).toContain('Jupiter');
      expect(callArgs.html).toContain('http://localhost:4200/ships/42');
    });

    it('throws error when transporter fails', async () => {
      // given
      const sendMailMock = jest
        .fn()
        .mockRejectedValue(new Error('SMTP connection failed'));
      const transporterMock = { sendMail: sendMailMock };
      const mailerService = new MailerService(transporterMock as any);

      const owner = new User(1, 'Test Pilot', 'pilot@example.com', true);
      const ship = ModelFactory.createShip({ owner });
      const location = ModelFactory.createLocation({});

      // when
      const promise = mailerService.sendMailNotification(ship, location);

      // then
      await expect(promise).rejects.toThrow('SMTP connection failed');
    });
  });
});
