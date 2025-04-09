import amqp from 'amqplib';
import dotenv from 'dotenv';
import connection from './services/connection.js';

dotenv.config();

const queue = 'processTask';
const exchange = 'processTaskExchange';
const routingKey = 'task';

connection(queue, exchange, routingKey, (task) => {
    
    fetch(task.data.callback.href, {
        method: task.data.callback.method,
        headers: {
            "x-api-key": task.data.callback.token,
        }
    })
})
