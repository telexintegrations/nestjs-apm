import { parentPort } from 'worker_threads';
import axios from 'axios';

parentPort?.on('message', async (data) => {
  try {
    const { webhookUrl, details } = data;

    const telexMessage = `High latency detected: ${details.method} ${details.url} took ${details.responseTime} ms`;

    const payload = {
      event_name: 'New Performance Alert',
      status: 'success',
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

    if (error.response) {
      console.error('Telex response error details:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else if (error.request) {
      console.error('No response received from Telex:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }

    parentPort?.postMessage('Error sending to Telex');
    process.exit(1);
  }
});
