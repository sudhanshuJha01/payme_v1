import React, { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "./ui/dialog";
import toast from 'react-hot-toast';

const AddMoneyDialog = ({ onPaymentSuccess }) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    const handleAddMoney = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Initiating payment...");

        try {
            const { data } = await api.post('/payment/add-money/create-order', {
                amount: Number(amount)
            });
            const order = data.order;

            const options = {
                key:import.meta.env.VITE_RAZORPAY_API_KEY,
                amount: order.amount,
                currency: "INR",
                name: "Payme Wallet",
                description: "Add Money to Wallet",
                order_id: order.id,
                handler: async function (response) {
                    // Step 3: Verify the payment on your backend
                    const verifyToastId = toast.loading("Verifying payment...");
                    try {
                        await api.post('/payment/add-money/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success("Money added successfully!", { id: verifyToastId });
                        onPaymentSuccess(); // Refresh the balance on the dashboard
                    } catch (verifyError) {
                        toast.error("Payment verification failed.", { id: verifyToastId });
                    }
                },
                prefill: {
                    name: user.fullname,
                    email: user.email,
                },
                theme: {
                    color: "#000000",
                },
            };
            
            toast.dismiss(toastId); // Dismiss the "initiating" toast

            // Step 4: Open the Razorpay Checkout form
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to start payment.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Money</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] animate-popup">
                <DialogHeader>
                    <DialogTitle>Add Money to Your Wallet</DialogTitle>

                    <DialogDescription>
                        Enter the amount you'd like to add.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleAddMoney}
                        disabled={isLoading || !amount || Number(amount) <= 0}
                        className="w-full"
                    >
                        {isLoading ? "Processing..." : `Add ₹${amount || '0'}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMoneyDialog;