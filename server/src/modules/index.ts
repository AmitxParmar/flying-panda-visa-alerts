import { Router } from 'express';

import auth from './auth/auth.route';
import alert from './alert/alert.route';


const router: Router = Router();

router.use('/auth', auth);
router.use('/alerts', alert);

export default router;


