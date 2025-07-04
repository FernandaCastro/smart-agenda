import { Request, Response } from 'express';
import { process } from '../services/task.services';

// export const listTasks = (_req: Request, res: Response) => {
//   const tasks = list();
//   res.json(tasks);
// };

// export const createTask = (req: Request, res: Response) => {
//   const newTask = create(req.body);
//   res.status(201).json(newTask);
// };

// export const updateTask = (req: Request, res: Response) => {
//   const id = req.params.id;
//   const updatedTask = update(id, req.body);
//   res.json(updatedTask);
// };


export const analyse = async (req: Request, res: Response) => {

  if (!req.body || !req.body.text) {
    return res.status(400).json({ erro: 'Text is not present.' });
  }

  try {
    const task = await process(req.body.text);
    return res.json(task);

  } catch (error) {
    console.error('Error analysing text:', error);
    res.status(500).json({ erro: 'Error analysing the Text' });
  }
};
