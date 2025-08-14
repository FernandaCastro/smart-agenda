import axios from "axios";
import { functionRegistry } from "./functionMeta";
import { AIResponse } from "./ai.model";
import { AppError } from "../error/error.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export async function dispatchFunction(req: AuthenticatedRequest, aiResponse: AIResponse, userId: string): Promise<any> {

  try {
    const def = functionRegistry[aiResponse.functionName];
    if (!def) {
      throw new AppError(405, `Function "${aiResponse.functionName}" not registered.`);
    }

    const path = typeof def.path === 'function' ? def.path(aiResponse.args) : def.path;
    const url = `${process.env.BASE_API_URL}${path}`;
    const headers = forwardAuthHeaders(req);
    const body = def.hasBody ? aiResponse.args : undefined;

    let response

    switch (def.method) {
      case 'get':
        response = await axios.get(url, { headers, params: aiResponse.args });
        break;
      case 'delete':
        response = await axios.delete(url, { headers, params: aiResponse.args });
        break;
      case 'post':
        response = await axios.post(url, body, { headers });
        break;
      case 'put':
        response = await axios.put(url, body, { headers });
        break;
      default:
        throw new AppError(405, `Unsupported method: ${def.method}`);
    }

    if (!response || response.status < 200 || response.status >= 300) {
      throw new AppError(response.status, response.statusText);
    }

    return response;

  } catch (error) {
    console.error('Error dispatching function:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.statusText || error.message;
      throw new AppError(error.response?.status || 502, errorMessage);
    }
    throw new AppError(502, `Failed to execute function ${aiResponse.functionName}`);
  }
}

export function forwardAuthHeaders(req: AuthenticatedRequest): Record<string, string> {
  const headers: Record<string, string> = {};

  const authHeader = req.headers['authorization'];
  const cookieHeader = req.headers['cookie'];

  if (authHeader) {
    headers['Authorization'] = authHeader;
  } else if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  headers['Content-Type'] = 'application/json; charset=UTF-8';

  return headers;
}
