import express from 'express'
import { login } from '../Controllers/auth.js'
import { updatechaneldata,getallchannel } from '../Controllers/channel.js'

const routes = express.Router();

routes.post('/login',login)
routes.patch('/update/:id',updatechaneldata)
routes.get('/getallChannel',getallchannel)

export default routes;