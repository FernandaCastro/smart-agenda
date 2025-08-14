import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export interface IAIService {
  analyseAndExecute(req: AuthenticatedRequest, userId: string, text: string, timezone: string): Promise<any>;
}