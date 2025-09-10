import React, { useState } from 'react';
import api from '../services/api';
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

const WithdrawDialog = ({ onWithdrawSuccess }) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleWithdraw = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Creating withdrawal link...");

        try {
            const { data } = await api.post('/payment/withdraw', {
                amount: Number(amount)
            });
            
            toast.success("Link created! Opening now...", { id: toastId });
            
            // Open the payment link in a new tab for the user to complete
            window.open(data.link, '_blank');

            // Refresh the balance on the dashboard optimistically
            onWithdrawSuccess(); 
            setOpen(false);
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Withdrawal failed.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Withdraw Money</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] animate-popup">
                <DialogHeader>
                    <DialogTitle>Withdraw Money</DialogTitle>
                    <DialogDescription>
                        Enter an amount to create a secure payment link. You will be redirected to complete the payment to your own UPI ID.
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
                {/* --- HELPFUL INFO ADDED HERE --- */}
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
                    <p><strong>How it works:</strong> A Razorpay link will be opened. You need to enter your own UPI ID to receive the money. Your wallet balance will only be deducted after the payment is successful.</p>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleWithdraw}
                        disabled={isLoading || !amount || Number(amount) <= 0}
                        className="w-full"
                    >
                        {isLoading ? "Processing..." : `Create Withdrawal Link`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawDialog;