import { Injectable, InternalServerErrorException } from '@nestjs/common';
import path from 'path';
import { google, calendar_v3 } from 'googleapis';
import fs from 'fs/promises';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

@Injectable()
export class GcalService {
  constructor(private readonly config: ConfigService) {}

  async events() {
    const googleClientEmail = this.config.getOrThrow<string>(
      'GOOGLE_CLIENT_EMAIL',
    );
    const googlePrivateKey =
      this.config.getOrThrow<string>('GOOGLE_PRIVATE_KEY');
    const googleProjectNumber = this.config.getOrThrow<string>(
      'GOOGLE_PROJECT_NUMBER',
    );
    const calendarId = this.config.getOrThrow<string>('GOOGLE_CALENDAR_ID');

    const client = new google.auth.JWT(
      googleClientEmail,
      null,
      googlePrivateKey,
      SCOPES,
    );

    const calendar = google.calendar({
      version: 'v3',
      auth: client,
    });

    return new Promise<calendar_v3.Schema$Events>((res, rej) => {
      calendar.events.list(
        {
          calendarId,
          timeMin: DateTime.now().toISO(),
          timeMax: DateTime.now().plus({ month: 1 }).toISO(),
          orderBy: 'startTime',
          singleEvents: true,
        },
        (error, result) => {
          if (error) {
            rej(error);
          }
          res(result.data);
        },
      );
    });
  }
}
