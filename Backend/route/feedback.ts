import { Router, Request, Response, NextFunction } from 'express';
import { addFeedback, getAllFeedback, getFeedbackById, deleteFeedback } from '../models/Feedback';

const feedbackRouter = Router();

feedbackRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedback = await addFeedback(req.body);
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
});

feedbackRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedback = await getAllFeedback();
    res.json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
});

feedbackRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const feedback = await getFeedbackById(id);

    if (!feedback) {
      const error: any = new Error('Feedback not found');
      error.status = 404;
      throw error;
    }

    res.json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
});

feedbackRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const deleted = await deleteFeedback(id);

    if (!deleted) {
      const error: any = new Error('Feedback not found');
      error.status = 404;
      throw error;
    }

    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
});

export default feedbackRouter;
