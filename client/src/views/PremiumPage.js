import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackPage from "components/common/BackPage";

const PremiumPage = () => {
    const [selectedPlan, setSelectedPlan] = useState("");

    const navigate = useNavigate();

    const plans = [
        {
            id: "Basic",
            title: "Basic",
            price: "₫632 / month",
            annualPrice: "₫7,581 billed annually (save 10%)",
            features: [
                "Small reply boost",
                "Encrypted direct messages",
                "Edit posts",
                "Post longer videos",
                "Longer posts",
                "Checkmark",
            ],
        },
        {
            id: "Premium",
            title: "Premium",
            price: "₫1,658 / month",
            annualPrice: "₫19,900 billed annually (save 12%)",
            features: [
                "Everything in Basic",
                "Half ads in For You and Following",
                "Larger reply boost",
                "Get paid to post",
                "Checkmark",
            ],
        },
        {
            id: "Premium+",
            title: "Premium+",
            price: "₫3,317 / month",
            annualPrice: "₫39,800 billed annually (save 12%)",
            features: [
                "Everything in Premium",
                "Fully ad-free",
                "Largest reply boost",
                "Checkmark",
            ],
        },
    ];

    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
    };

    const selectedPlanDetails = plans.find((plan) => plan.id === selectedPlan);

    const handleSubscribe = () => {
        if (selectedPlanDetails) {
            navigate("/payment", { state: { plan: selectedPlanDetails } });
        }
    };

    return (
        <>
            <BackPage haveBackBtn={false}>
                <div className="flex flex-col px-2">
                    <h4 className="text-lg font-bold">Premiums</h4>
                    <p className="text-[13px] font-normal text-text4">
                        You can upgrade your account here.
                    </p>
                </div>
            </BackPage>
            <div className="flex flex-col px-4 py-6">
                <h4 className="text-xl font-bold text-center">Premium Plans</h4>
                <p className="text-sm text-text4 text-center mb-6">
                    Choose the plan that suits you best!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`border rounded-lg p-4 shadow-lg cursor-pointer ${
                                selectedPlan === plan.id ? "border-primary" : ""
                            }`}
                            onClick={() => handleSelectPlan(plan.id)}
                        >
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold">{plan.title}</h5>
                                {selectedPlan === plan.id && (
                                    <span className="text-primary text-2xl">✔️</span>
                                )}
                            </div>
                            <p className="text-xl font-bold text-primary">{plan.price}</p>
                            <p className="text-xs text-text4">{plan.annualPrice}</p>
                            <ul className="mt-4 space-y-2 text-sm text-text3">
                                {plan.features.map((feature, index) => (
                                    <li key={index}>✔️ {feature}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {selectedPlan && (
                    <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50">
                        <h4 className="text-lg font-bold text-primary text-center">
                            {selectedPlanDetails?.title}
                        </h4>
                        <p className="text-center text-xl font-bold text-primary">
                            {selectedPlanDetails?.price}
                        </p>
                        <button
                            className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark"
                            onClick={handleSubscribe}
                        >
                            Subscribe & Pay
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default PremiumPage;
