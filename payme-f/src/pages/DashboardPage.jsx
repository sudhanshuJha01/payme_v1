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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Search, Send, Wallet } from 'lucide-react';

const Balance = ({ value }) => (
    <div className="bg-card/30 p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-muted-foreground">Your Balance</h2>
        </div>
        <p className="text-4xl font-bold">
            ₹ {value != null ? value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "0.00"}
        </p>
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
    const { accessToken, user: currentUser } = useAuthStore();
    const debounceTimeout = useRef(null);

    const fetchBalance = useCallback(async () => {
        if (!accessToken) return;
        try {
            const response = await api.get("/account/balance");
            setBalance(response.data.balance);
        } catch (error) {
            toast.error("Could not fetch balance.");
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
                const filteredUsers = response.data.users.filter(user => user._id !== currentUser._id);
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
            await api.post("/account/transfer", { to: selectedUser._id, amount: Number(amount) });
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
        <div className="animate-popup max-w-4xl mx-auto space-y-8">
            <Toaster position="top-center" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Balance value={balance} />
                <div className="flex w-full sm:w-auto gap-3">
                    <AddMoneyDialog onPaymentSuccess={fetchBalance} />
                    <WithdrawDialog onWithdrawSuccess={fetchBalance} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Send className="h-5 w-5" /> Send Money</h2>
                    <div className="bg-card/30 p-4 rounded-xl border border-border/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="mt-4 space-y-2 min-h-[60px]">
                            {isSearching ? (
                                <p className="text-center text-muted-foreground py-4">Searching...</p>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <div key={user._id} className="flex items-center justify-between p-2 rounded-md hover:bg-card">
                                        <div className="flex items-center gap-3">
                                            <Avatar><AvatarFallback>{user.fullname.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="font-semibold">{user.fullname}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => setSelectedUser(user)}>Send</Button>
                                    </div>
                                ))
                            ) : searchQuery && (
                                <p className="text-center text-muted-foreground py-4">No users found.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                     <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                     <RecentTransactions />
                </div>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-[425px] animate-popup">
                    <DialogHeader>
                        <DialogTitle>Send Money</DialogTitle>
                        <DialogDescription>Transfer funds to {selectedUser?.fullname}.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar><AvatarFallback>{selectedUser?.fullname.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold text-lg">{selectedUser?.fullname}</p>
                                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                            </div>
                        </div>
                        <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
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