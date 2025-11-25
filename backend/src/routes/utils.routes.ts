import { Router } from 'express';
import { listEquipments, listLocations, listLogs, addEquipment, addLocation } from '../controllers/utils.controller';

const router = Router();

router.get('/equipments', listEquipments);
router.post('/equipments', addEquipment);
router.get('/locations', listLocations);
router.post('/locations', addLocation);
router.get('/logs', listLogs);

export default router;
