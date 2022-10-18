import { Application, Request, Response, Router } from "express";
import { AuthController } from "./controllers/v1/AuthController";

const ApiV1 = () => {
    let route = Router();
    route.use(`/${AuthController.name}`, AuthController.routers());
    return route;
}


export function routes(app: Application) {
    app.use(`/api/v1`, ApiV1());

    app.get('/*', (req: Request, res: Response) => {
        return res.status(405).send({
            status: 405,
            message: 'method_not_allowed',
        });
    });

    app.post('/*', (req: Request, res: Response) => {
        return res.status(405).send({
            status: 405,
            message: 'method_not_allowed',
        });
    });

    app.use((err, req, res, next) => {
        console.log(err);
        return res.status(500).send({
          status: 500,
          message: req.__('server_error'),
        });
      });
}