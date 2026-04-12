import { Router } from 'express';
import upload from '../middlewares/upload';
import { getBuildings, getBuilding, createBuilding, editBuilding, removeBuilding } from '../controller/buildingController';

const buildingRouter = Router();

buildingRouter.get('/', getBuildings);
buildingRouter.get('/:id', getBuilding);
buildingRouter.post('/', upload.single('images'), createBuilding);
buildingRouter.put('/:id', upload.single('images'), editBuilding);
buildingRouter.delete('/:id', removeBuilding);

export default buildingRouter;
