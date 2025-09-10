import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import toast, { Toaster } from 'react-hot-toast';
import RecentTransactions from '../components/RecentTransactions';
import AddMoneyDialog from '../components/AddMoneyDialog';
import WithdrawDialog from '../components/WithdrawDialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

const Balance = ({ value }) => (
    <div>
        <h2 className="text-lg font-semibold text-muted-foreground">Your Balance</h2>
        <p className="text-4xl font-bold">₹ {value != null ? value.toFixed(2) : "Loading..."}</p>
    </div>
);

const DashboardPage = () => {
    const [balance, setBalance] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { user: currentUser } = useAuthStore();
    const { accessToken } = useAuthStore();
    const debounceTimeout = useRef(null);

    const fetchBalance = useCallback(async () => {
        if (!accessToken) return;
        try {
            const response = await api.get("/account/balance");
            setBalance(response.data.balance);
        } catch (error) {
            toast.error("Could not fetch your balance.");
        }
    }, [accessToken]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);
  useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (searchQuery.trim() === "") {
            setUsers([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await api.get(`/user/search?filter=${searchQuery}`);
                // --- ADDED FILTER LOGIC HERE ---
                const filteredUsers = response.data.users.filter(
                    user => user._id !== currentUser._id
                );
                setUsers(filteredUsers);
            } catch (error) {
                toast.error("Failed to search for users.");
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
    }, [searchQuery, currentUser]);

    const handleTransfer = async () => {
        setIsTransferring(true);
        const toastId = toast.loading("Processing transfer...");
        try {
            await api.post("/account/transfer", {
                to: selectedUser._id,
                amount: Number(amount),
            });
            toast.success("Transfer successful!", { id: toastId });
            fetchBalance();
            setSelectedUser(null);
            setAmount("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Transfer failed.", { id: toastId });
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div className="animate-popup space-y-8">
            <Toaster position="top-center" />
            <div className="flex items-center justify-between">
                <Balance value={balance} />
                <div className="flex gap-2">
                    <AddMoneyDialog onPaymentSuccess={fetchBalance} />
                    <WithdrawDialog onWithdrawSuccess={fetchBalance} />
                </div>
            </div>
            <Separator />
            <div>
                <h2 className="text-lg font-bold">Send Money</h2>
                <Input
                    type="text"
                    placeholder="Search by name or email..."
                    className="mt-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="mt-4 space-y-2 min-h-[50px]">
                    {isSearching ? (
                        <p className="text-muted-foreground">Searching...</p>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <div key={user._id} className="flex items-center justify-between p-2 rounded-md hover:bg-card">
                                <div className="flex items-center gap-4">
                                    <Avatar><AvatarFallback>{user.fullname.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                                    <div>
                                        <p className="font-semibold">{user.fullname}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <Button onClick={() => setSelectedUser(user)}>Send Money</Button>
                            </div>
                        ))
                    ) : searchQuery && (
                        <p className="text-muted-foreground">No users found.</p>
                    )}
                </div>
            </div>
            <Separator />
            <RecentTransactions />

            {/* Send Money Dialog (Modal) */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-[425px] animate-popup">
                    <DialogHeader>
                        <DialogTitle>Send Money</DialogTitle>
                        <DialogDescription>Transfer funds to {selectedUser?.fullname}.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar><AvatarFallback>{selectedUser?.fullname.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                            <p className="font-semibold text-lg">{selectedUser?.fullname}</p>
                        </div>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleTransfer} disabled={isTransferring || !amount || Number(amount) <= 0} className="w-full">
                            {isTransferring ? "Sending..." : "Confirm Transfer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DashboardPage;