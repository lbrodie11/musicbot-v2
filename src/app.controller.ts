import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    return this.appService.login(req, res);
  }

  @Get('/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    this.appService.callback(req, res);
  }
}
