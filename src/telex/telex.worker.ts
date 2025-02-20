import { parentPort } from 'worker_threads';
import axios from 'axios';

parentPort?.on('message', async (data) => {
  try {
    const { webhookUrl, errorDetails } = data;

    const { url, method, message, stack } = errorDetails;
    const fixedStack = stack
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '    ')
      .replace(/ode_modules/g, 'node_modules');

    // Construct the payload
    const payload = {
      event_name: 'New Error Alert',
      status: 'error',
      username: 'NestJS APM',
      message: `Details: \nurl: ${url} \nmethod: ${method} \nmessage: ${message} \nstack: ${fixedStack}`,
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
    if (error.response) {
      console.error('Telex response error details:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    }
    parentPort?.postMessage('Error sending to Telex');
    process.exit(1);
  }
});
