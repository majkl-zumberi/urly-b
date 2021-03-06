import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/core/enums/role.enum';
import { v1 as uuidv1 } from 'uuid';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { TokenVerifyEmail, User } from './user.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('TokenVerifyEmail') private tokenVerifyEmailModel: Model<TokenVerifyEmail>,
        private jwtService: JwtService,
    ) { }

    async createUser(authCredentialsDto: AuthCredentialsDto) {

        let userToAttempt = await this.findOneByEmail(authCredentialsDto.email);
        if (!userToAttempt) {
            const newUser = new this.userModel({
                email: authCredentialsDto.email,
                password: authCredentialsDto.password,
                roles: Role.User
            });
            return await newUser.save().then((user) => {
                const newTokenVerifyEmail = new this.tokenVerifyEmailModel({
                    userId: user._id,
                    tokenVerifyEmail: uuidv1()
                });
                newTokenVerifyEmail.save();
                return user.toObject({ versionKey: false});
            });
        } else {
            return new BadRequestException('Email already exist!');
        }
    }

    async validateUserByPassword(authCredentialsDto: AuthCredentialsDto) {
        let userToAttempt: any = await this.findOneByEmail(authCredentialsDto.email);
        if (!userToAttempt) throw new BadRequestException('Email non trovata!');
        return new Promise((resolve, reject) => {
            userToAttempt.checkPassword(authCredentialsDto.password, (err, isMatch) => {
                if (err) {
                    reject(new UnauthorizedException());
                }
                if (isMatch) {
                    const payload: any = {
                        token: this.createJwtPayload(userToAttempt),
                        isAdmin:userToAttempt.roles.includes('admin')
                    }
                    resolve(payload);
                } else {
                    reject(new BadRequestException(`Password non corretta`));
                }
            });
        });
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email: email });
    }

    async getAllUsers() {
        return await this.userModel.find();
    }

    async totalusers() {
        const totalUsers=await this.userModel.estimatedDocumentCount();
        return {totalUsers};
    }

    async validateUserByJwt(payload: JwtPayload) {
        let user = await this.findOneByEmail(payload.email);
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }

    createJwtPayload(user) {
        console.log({user})
        let data: JwtPayload = {
            _id: user._id,
            email: user.email
        };
        return this.jwtService.sign(data);
    }

}

