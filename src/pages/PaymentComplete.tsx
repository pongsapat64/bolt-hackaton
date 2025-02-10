import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <CheckCircle className="text-green-500 w-24 h-24 mb-4" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">ชำระเงินสำเร็จ!</h1>
      <p className="text-gray-700">ผู้ใช้ได้ทำการชำระเงินเรียบร้อยแล้ว</p>
 

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate("/processing")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default PaymentComplete;
