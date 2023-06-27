const Joi = require('joi');
const RefreshToken = require("../modles/token");
const User = require('../modles/user');
const bcrypt = require('bcryptjs');
const JWTService = require('../service/JWTservice');
const UserDto = require('../dto/user');



const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const authcontorller = {
    async register(req, res, next) {
        //1. validate user input
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattren).required(),
            confirmPassword: Joi.ref('password')
        })
        const { error } = userRegisterSchema.validate(req.body);
        //2. if error in validation -> return via middleware
        if (error) {
            return next(error);
        }
        //3. if email or username is already register -> return an error
        const { username, name, email, password } = req.body;
        try {
            const emailInUse = await User.exists({ email })

            const usernameInUse = await User.exists({ username })

            if (emailInUse) {
                const error = {
                    status: 409,
                    message: 'Email already registered Use an other email'
                }
                return next(error)
            }
            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: 'username already registered Use an other username'
                }
                return next(error)
            }
        } catch (error) {
            return next(error)
        }

        //4. paswordhash
        const hashedPassword = await bcrypt.hash(password, 10)
        //5. store user date in db
        let accessToken;
        let refreshToken;
        let user
        try {
            const userToRegister = new User({
                username : username,
                email : email,
                name : name,
                password: hashedPassword
            });
            user = await userToRegister.save();
            accessToken = JWTService.signAccessToken({ _id: user._id }, '30m')
            refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m')
        } catch (error) {
            return next(error)
        }
        //store resfresh token in data base
        await JWTService.storeRefreshToken(refreshToken, user._id)

        //send cookies
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })



        //6. responce send
        const userDto = new UserDto(user)
        return res.status(201).json({ user: userDto, auth: true });
    },
    async login(req, res, next) {
        //1 validate user input
        //2 if validation error, return error
        //3 match user name and possword
        //4 return responce

        // we expext the data in following  shape
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattren)
        })
        const { error } = userLoginSchema.validate(req.body)

        if (error) {
            return next(error)
        }
        const { username, password } = req.body
        let user;
        try {
            user = await User.findOne({ username: username })

            if (!user) {
                const error = {
                    status: 401,
                    message: "invalid username"
                }
                return next(error)
            }
            //   match password
            //   req.body.password ->hash=>match

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                const error = {
                    status: 401,
                    message: 'Invalid password'

                }
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m")
        const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m")

        //Update refreshToken in data base
        try {
            await RefreshToken.updateOne({
                _id: user._id
            },
                {
                    token: refreshToken
                },
                {
                    upsert: true
                }
            )
        } catch (error) {
            return next(error);
        }



        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        const userDto = new UserDto(user);

        return res.status(200).json({ user: userDto, auth: true })
    },
    //logout>>
    async logout(req, res, next) {
        console.log(req);
        // deletes token from data base
        const { refreshToken } = req.cookies;
        try {
            await RefreshToken.deleteOne({ token: refreshToken })
        } catch (error) {
            return next(error);
        }

        //delete
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        //responce
        res.status(200).json({ user: null, auth: false })
    },
    async refresh(req, res, next) {
        // refresh token from cookies
        //verify refresh token
        //genrate refresh token
        //update data base
        //Responce
        const originalRefreshToken = req.cookies.refreshToken;
        let id;
        try {
            id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        } catch (e) {
            const error = {
                status: 401,
                message: 'Unauthorized1'
            }
            return next(error);
        }
        try {
            const match = RefreshToken.findOne({ _id: id, token: originalRefreshToken })
            if (!match) { 
                const error = {
                    status: 401,
                    message: 'Unauthorized2'
                }
                return next(error);

            }
        } catch (e) {
            return next(e);
        }

        try {
            const accessToken = JWTService.signAccessToken({ _id: id }, "30m")
            const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m")

            await RefreshToken.updateOne({ _id: id}, {token: refreshToken} )
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })
            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })
        } catch (e) {
            return next(e)
        }
        const user = await User.findOne({ _id: id })
        const userDto = new UserDto(user)
        return res.status(200).json({ user: userDto, auth: true })
    }
}
module.exports = authcontorller;
