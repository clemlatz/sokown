import 'dotenv/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import Ship from '../models/Ship';
import Location from '../models/Location';

export default class MailerService {
  private readonly transporter: Transporter;
  private readonly fromName: string;
  private readonly fromAddress: string;

  constructor(transporter: Transporter) {
    this.transporter = transporter;

    const envFromName = process.env.SMTP_FROM_NAME;
    const envFromAddress = process.env.SMTP_FROM_ADDRESS;

    if (!envFromAddress || envFromAddress.trim().length === 0) {
      throw new Error(
        'SMTP_FROM_ADDRESS environment variable is required for MailerService.',
      );
    }

    this.fromName =
      envFromName && envFromName.trim().length > 0
        ? envFromName
        : 'The Sokown Company';
    this.fromAddress = envFromAddress;
  }

  async sendMailNotification(ship: Ship, location: Location): Promise<void> {
    const mailOptions = {
      from: `"${this.fromName}" <${this.fromAddress}>`,
      to: ship.owner.email,
      subject: `${ship.name} has arrived at ${location.name}`,
      text: this._buildPlainTextBody(ship, location),
      html: this._buildHtmlBody(ship, location),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private _buildPlainTextBody(ship: Ship, location: Location): string {
    const shipUrl = this._buildShipUrl(ship);
    return `Your ship ${ship.name} has arrived at ${location.name}.

Position: ${ship.currentPosition}
View ship: ${shipUrl}

The Sokown Company`;
  }

  private _buildHtmlBody(ship: Ship, location: Location): string {
    const shipUrl = this._buildShipUrl(ship);
    return `
      <p>Your ship <strong>${ship.name}</strong> has arrived at <strong>${location.name}</strong>.</p>
      <p>Position: ${ship.currentPosition}</p>
      <p><a href="${shipUrl}">View ship</a></p>
      <p><em>The Sokown Company</em></p>
    `;
  }

  private _buildShipUrl(ship: Ship): string {
    const baseUrl = process.env.APP_URL || 'http://localhost:4200';
    return `${baseUrl}/ships/${ship.id}`;
  }

  static factory = {
    provide: MailerService,
    useFactory: async () => {
      const smtpHost = process.env.SMTP_HOST;
      if (!smtpHost) {
        throw new Error('SMTP_HOST environment variable is not defined');
      }

      const transportOptions: nodemailer.TransportOptions = {
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        ...(process.env.SMTP_USER && process.env.SMTP_PASSWORD
          ? {
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
            }
          : {}),
      };
      const transporter = nodemailer.createTransport(transportOptions);
      return new MailerService(transporter);
    },
  };
}
