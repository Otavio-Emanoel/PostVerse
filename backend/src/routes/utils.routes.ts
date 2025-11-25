import { Router } from 'express';
import { listEquipments, listLocations, listLogs } from '../controllers/utils.controller';

const router = Router();

router.get('/equipments', listEquipments);
router.get('/locations', listLocations);
router.get('/logs', listLogs);

export default router;
