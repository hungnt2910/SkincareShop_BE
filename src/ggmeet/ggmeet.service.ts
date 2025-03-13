// import { SpacesServiceClient } from '@google-apps/meet';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/typeorm/entities';
// import { Repository } from 'typeorm';
// import { GoogleAuth } from 'google-auth-library';

// @Injectable()
// export class GgmeetService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>
//   ) {}

//   async createSpace() {
//     // Authenticate using GoogleAuth
//     const auth = new GoogleAuth({
//       keyFilename: 'F:/FPT University/SPRING2025/SWD/swp391-milkmartsystem-0b8bf88e0580.json',
//       scopes: ['https://www.googleapis.com/auth/meetings.space.create'],
//     });

//     // Get the authenticated client
//     const authClient = await auth.getClient();

//     // Create the Meet client and pass the correct authClient
//     const meetClient = new SpacesServiceClient({
//       authClient: authClient as any, // Temporary workaround for type issue
//     });

//     // Construct request
//     const request = {};

//     // Run request
//     const response = await meetClient.createSpace(request);
//     console.log(`Meet URL: ${response[0].meetingUri}`);
//     return response;
//   }
// }
