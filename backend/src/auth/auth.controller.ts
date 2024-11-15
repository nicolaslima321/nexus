// import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('auth')
// export class AuthController {
//   @Get('github')
//   @UseGuards(AuthGuard('github'))
//   async githubAuth(@Req() req) {
    
//   }

//   @Get('github/callback')
//   @UseGuards(AuthGuard('github'))
//   githubAuthRedirect(@Req() req) {
//     console.log('req');
//     console.log(req);

//     return {
//       message: 'Login bem-sucedido',
//       user: req.user,
//     };
//   }
// }
