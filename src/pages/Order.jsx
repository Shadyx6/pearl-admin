import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${backendUrl}/api/order/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-700">Order ID: {order._id}</h3>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.paymentStatus}
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-3">
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
              </div>

              {/* Address Info */}
              <div className="mb-3">
                <p><strong>City:</strong> {order.city}</p>
                <p><strong>State:</strong> {order.state}</p>
                <p><strong>Full Address:</strong> {order.address}</p>
                {order.note && <p><strong>Note:</strong> {order.note}</p>}
              </div>

              {/* Payment Info */}
              <div className="mb-3">
                <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                <p><strong>Advance Paid:</strong> {currency} {order.advancePaid}</p>
                <p><strong>Total Amount:</strong> {currency} {order.total}</p>
              </div>

              {/* Products */}
              <div className="mb-3">
                <p className="font-medium">Products:</p>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} = {currency} {item.total}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Time */}
              <p className="text-xs text-gray-400 mt-2">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
