import * as dotenv from 'dotenv'

export const GetEnviroment = () =>
{
    dotenv.config({ override: true, 
                    path: `src/helper/Env/.env.${process.env.ENV}`})
}