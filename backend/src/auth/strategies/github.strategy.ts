// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-github2';

// @Injectable()
// export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
//   constructor() {
//     super({
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: 'http://localhost:3000/auth/github/callback',
//       scope: ['user:email'],
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any) {
//     const { id, username, photos, emails } = profile;

//     console.log({ accessToken, refreshToken, profile });

//     return {
//       id,
//       username,
//       avatar: photos[0].value,
//       email: emails && emails[0]?.value,
//     };
//   }
// }
