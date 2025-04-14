import amqp from 'amqplib';
import dotenv from 'dotenv';
import connection from './services/connection.js';

dotenv.config();

const taskQueue = 'taskQueue'; 
const debtQueue = 'debtQueue'; 
const orderQueue = 'orderQueue';
const exchange = 'processExchange';

const processTask = (task) => {
    fetch(task.data.callback.href, {
      method: task.data.callback.method,
      headers: {
        "x-api-key": task.data.callback.token,
      },
    });

};

const processDebt =  (order) => {
    const { userId, products, orderId } = order.data;

    const subtotal = products.reduce(
      (acc, product) => acc + product.quantity * product.value, 0
    );

    fetch(order.data.callback.href, {
      method: order.data.callback.method,
      headers: {
        "x-api-key": order.data.callback.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userId,
        order: orderId,
        products,
        totalAmount: subtotal,
      }),
    });
};

const processOrder = (order) => {
    const { status } = order.data;

    fetch(order.data.callback.href, {
      method: order.data.callback.method,
      headers: {
        "x-api-key": order.data.callback.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
};

// Conectando e consumindo as filas
connection(taskQueue, exchange, taskQueue, processTask);
connection(debtQueue, exchange, debtQueue, processDebt);
connection(orderQueue, exchange, orderQueue, processOrder);
