import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities'
import { Meet } from 'src/typeorm/entities/Meet';
import { Repository } from 'typeorm';



@Injectable()
export class GoogleMeetService {
  constructor(
    @InjectRepository(Meet)
    private readonly googleMeetRepository: Repository<Meet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private meetLinks = [
    'meet.google.com/jrn-xekj-xds',
    'meet.google.com/raj-ptww-nbv',
    'meet.google.com/rxp-itdu-aeg',
    'meet.google.com/apo-nqvf-rnu',
    'meet.google.com/eee-gudk-xck',
    'meet.google.com/vgy-brwy-fpn',
    'meet.google.com/oqz-eisq-nwr',
  ];

  async createGoogleMeetLink(userId: number): Promise<Meet> {
    try {
      const randomLink = this.meetLinks[Math.floor(Math.random() * this.meetLinks.length)];
      const googleMeetLink = this.googleMeetRepository.create({
        link: randomLink,
        user: { id: userId },
      });

      return await this.googleMeetRepository.save(googleMeetLink);
    } catch (error) {
      console.error('Error creating Google Meet link:', error);
      throw new Error('Failed to create Google Meet link');
    }
  }

  async assignStaffToMeetLink(userId: number, staffId: number): Promise<string | null> {
    try {
      const meetLink = await this.googleMeetRepository.findOne({ where: { user: { id: userId } } });
      if (!meetLink) {
        console.error('No Google Meet link found for this user');
        return null;
      }

      meetLink.staff = { id: staffId } as User;
      await this.googleMeetRepository.save(meetLink);
      return meetLink.link;
    } catch (error) {
      console.error('Error assigning staff to Google Meet link:', error);
      return null;
    }
  }
}
