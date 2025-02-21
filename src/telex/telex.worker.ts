import { parentPort } from 'worker_threads';
import axios from 'axios';

import { ITelexErrorWorkerData, ITelexPayload } from './telex.interface';

parentPort?.on('message', async (data: ITelexErrorWorkerData) => {
  try {
    const { webhookUrl, details } = data;

    const { url, method, message, stack } = details;
    const fixedStack = stack.replace(/\\n/g, '\n').replace(/\\t/g, '    ');

    const telexMessage = `🔕Error detected: ${method} ${url} \nmessage: ${message} \nstack: ${fixedStack}`;

    // Construct the payload
    const payload: ITelexPayload = {
      event_name: 'New Error Alert',
      status: 'error',
      username: 'NestJS APM',
      message: telexMessage,
    };

    const response = await axios.post(webhookUrl, payload, { timeout: 5000 });

    if (response.data.status === 400) {
      console.error(
        'Failed to send Telex notification, status:',
        response.status,
      );
      parentPort?.postMessage('Error sending to Telex');
      process.exit(1);
    }

    parentPort?.postMessage('Telex Notification sent successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error sending to Telex:', error.message);
    parentPort?.postMessage('Error sending to Telex');
    process.exit(1);
  }
});
