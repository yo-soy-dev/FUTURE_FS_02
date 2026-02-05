import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/ClientNavbar";

export default function InvestorPlans() {
    const [plans, setPlans] = useState([]);
    const [myLead, setMyLead] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));


    useEffect(() => {
        loadPlans();
        fetchMyLead();
    }, []);

    const fetchMyLead = async () => {
        try {
            const res = await api.get("/leads/my");
            if (res.data) {
                setMyLead(Array.isArray(res.data) ? res.data : [res.data]);
            } else {
                setMyLead([]);
            }
        } catch (err) {
            setMyLead([]);
        }
    };

    const isInterested = (planId) => {
        return myLead.some(l => l.source === planId);
    };


    const loadPlans = async () => {
        const res = await api.get("/inventory/public");
        setPlans(res.data);
    };

    const interested = async (plan) => {

        if (isInterested(plan._id)) {
            return alert("Aap is plan me already interest dikha chuke ho.");
        }
        await api.post("/leads", {
            name: user.name,
            email: user.email,
            source: plan._id,
            notes: `Interested in ${plan.name}`
        });

        alert("Interest send ho gaya!");
        fetchMyLead();
    };

    return (
        <div className="p-6">
            <Navbar />

            <h2 className="text-2xl font-bold mb-4">
                Investment Plans
            </h2>

            <div className="grid grid-cols-3 gap-4">

                {plans.map(p => (
                    <div key={p._id} className="bg-white p-4 shadow">

                        <h3 className="font-bold text-lg">
                            {p.name}
                        </h3>

                        <p>Price: ₹{p.price}</p>
                        <p>Status: {p.status}</p>

                        <button
                            onClick={() => interested(p)}

                            disabled={
                                p.status === "Out of Stock" ||
                                isInterested(p._id)
                            }


                            className={`mt-2 px-3 py-1 rounded text-white ${p.status === "Out of Stock" || isInterested(p._id)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600"
                                }`}
                        >
                            {p.status === "Out of Stock"
                                ? "Not Available"
                                : isInterested(p._id)
                                    ? "Already Interested"
                                    : "Interested"}
                        </button>



                    </div>
                ))}

            </div>
        </div>
    );
}
