import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BackPage from "components/common/BackPage";

const PaymentPage = () => {
    const location = useLocation();
    const { plan } = location.state || {};

    // State để lưu thông tin đầu vào và lỗi
    const [formData, setFormData] = useState({
        email: "",
        cardNumber: "",
        cardName: "",
        country: "",
        expiryDate: "",
        cvc: "",
    });

    const [errors, setErrors] = useState({});

    // Hàm xử lý khi thay đổi giá trị các trường nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm kiểm tra đầu vào
    const validate = () => {
        const newErrors = {};
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Tháng hiện tại (1 - 12)
        const currentYear = currentDate.getFullYear() % 100; // Lấy 2 chữ số cuối của năm hiện tại

        // Kiểm tra email
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
            newErrors.email = "Email must be a valid @gmail.com address.";
        }

        // Kiểm tra số thẻ
        if (!formData.cardNumber) {
            newErrors.cardNumber = "Card number is required.";
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
            newErrors.cardNumber = "Card number must be 16 digits.";
        }

        // Kiểm tra tên chủ thẻ
        if (!formData.cardName) {
            newErrors.cardName = "Cardholder name is required.";
        }

        // Kiểm tra ngày hết hạn
        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required.";
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Expiry date must be in MM/YY format.";
        } else {
            const [expiryMonth, expiryYear] = formData.expiryDate.split("/").map((item) => parseInt(item));
            
            // Kiểm tra nếu năm hết hạn nhỏ hơn năm hiện tại hoặc nếu năm hết hạn bằng năm hiện tại nhưng tháng nhỏ hơn tháng hiện tại
            if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                newErrors.expiryDate = "Expiry date cannot be in the past.";
            }
        }

        // Kiểm tra CVC
        if (!formData.cvc) {
            newErrors.cvc = "CVC is required.";
        } else if (!/^\d{3}$/.test(formData.cvc)) {
            newErrors.cvc = "CVC must be 3 digits.";
        }

        // Kiểm tra quốc gia
        if (!formData.country) {
            newErrors.country = "Country or region is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm xử lý khi submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            alert("Form submitted successfully!");
        }
    };

    return (
        <>
            <BackPage haveBackBtn={true}>
                <div className="flex flex-col px-2">
                    <h4 className="text-lg font-bold">Thanh toán bằng thẻ</h4>
                </div>
            </BackPage>
            <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg mt-6">
                <h4 className="text-xl font-bold text-center mb-4">Payment Details</h4>
                {plan ? (
                    <>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            {/* Thông tin thẻ */}
                            <div>
                                <label className="block text-sm font-semibold">
                                    Card information
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="1234 1234 1234 1234"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg pr-12"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                            alt="Visa"
                                            className="w-6 h-6"
                                        />
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                            alt="MasterCard"
                                            className="w-6 h-6"
                                        />
                                    </div>
                                </div>
                                {errors.cardNumber && (
                                    <p className="text-red-500 text-sm">{errors.cardNumber}</p>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        placeholder="MM / YY"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        className="w-1/2 p-3 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="cvc"
                                        placeholder="CVC"
                                        value={formData.cvc}
                                        onChange={handleChange}
                                        className="w-1/2 p-3 border rounded-lg"
                                    />
                                </div>
                                {errors.expiryDate && (
                                    <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                                )}
                                {errors.cvc && (
                                    <p className="text-red-500 text-sm">{errors.cvc}</p>
                                )}
                            </div>

                            {/* Tên chủ thẻ */}
                            <div>
                                <label className="block text-sm font-semibold">
                                    Cardholder name
                                </label>
                                <input
                                    type="text"
                                    name="cardName"
                                    placeholder="Full Name"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg"
                                />
                                {errors.cardName && (
                                    <p className="text-red-500 text-sm">{errors.cardName}</p>
                                )}
                            </div>

                            {/* Quốc gia hoặc khu vực */}
                            <div>
                                <label className="block text-sm font-semibold">
                                    Country or region
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg"
                                >
                                    <option value="">Select a country</option>
                                    <option value="Vietnam">Vietnam</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Ukraina">Ukraina</option>
                                </select>
                                {errors.country && (
                                    <p className="text-red-500 text-sm">{errors.country}</p>
                                )}
                            </div>

                            {/* Nút đăng ký */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark"
                            >
                                Register
                            </button>
                        </form>
                    </>
                ) : (
                    <p className="text-center text-text4">No plan selected.</p>
                )}
            </div>
        </>
    );
};

export default PaymentPage;
