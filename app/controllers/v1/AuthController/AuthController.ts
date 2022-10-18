import { Request, Response, NextFunction, Router } from "express";
import * as yup from 'Yup';
import { User } from "../../../models/User";
import jwt from 'jsonwebtoken';
import { validateYup } from "../../../utilis/validations";
import * as bcrypt from 'bcrypt';
import { validateJWT } from "../../../policies/General";

export class AuthController {

    public name = 'auth';
    protected router = Router();

    constructor() {
        this.router.use((req: Request, res: Response, next: NextFunction)=>{
            if (req.session == null) {
                req.session = {};
            }
            return next();
        });
    } 

    routers() {
        this.router.post('/', (req: Request, res: Response, next: NextFunction) => this.login(req, res, next),);
        this.router.post('/signup', (req: Request, res: Response, next: NextFunction) => this.signup(req, res, next),)
        this.router.get('/profile', validateJWT, (req: Request, res: Response, next: NextFunction) => this.profile(req, res, next))
        
        return this.router;
    }

    protected getCredencials(data: {}) {
        return jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 60 * 24 ,
        });
    }

    async login(req: Request, res: Response, next: NextFunction) {
        let user;
        try {
            user = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
    
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: "El usuario no ha sido encontrado"
            })
        }

        let userValidate;
        try {
            userValidate = await bcrypt.compare(req.body.password, user.password);

        } catch (error) {
            return res.status(409).json("Favor de veirificar los parametros de entrada")
        }


        if (userValidate) {
            const token = this.getCredencials({ id: user.id });

            return res.status(200).json({
                status: 200,
                token: token,
                message: "Has iniciado sesión con exito",
                data: user
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "Una disculpa, a ocurrido un error, favor de verificar sus datos.",
                data: {}
            });
        }
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        const schema = yup.object().shape({
            name: yup.string(),
            email: yup.string(),
            password: yup.string().min(6)
        });

        try {
            await validateYup(req.body, schema);
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: 400,
                message: error.errors[0],
                data: {},
            });
        }
        let password: string;
        try {
            password = await bcrypt.hash(req.body.password, 12);

        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: "Favor de verificar sus datos",
                data: {},
            });
        }

        let newUser = {
            email: (req.body.email as string).toLowerCase(),
            password: password,
            name: req.body.name,
        };


        let user;
        try {
            user = await User.create(newUser);
        } catch (err) {
            if (
                err.errors != null &&
                err.errors.length &&
                err.errors[0].type === 'unique violation' &&
                err.errors[0].path === 'email'
            ) {
                return res.status(400).json({
                    status: 400,
                    message: 'Ya existe un usuario con el correo el correo electrónico.'
                });
            }

            throw err;
        }

        const token = this.getCredencials({ id: user.id });

        return res.status(200).json({
            status: 200,
            token,
            data: user
        });
    }

    async profile(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({
            status: 200,
            data: req.session.user
        });
    }
}

const controller = new AuthController();
export default controller;