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
import { Search, Send, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Plus, Minus, Clock, Activity } from 'lucide-react';



const Balance = ({ value }) => (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl backdrop-blur-sm">
                    <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Available Balance</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Ready to use
                    </p>
                </div>
            </div>
            <p className="text-4xl font-bold text-foreground">
                ₹{value != null ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
            </p>
        </div>
    </div>
);



const QuickActions = ({ children }) => (
    <div className="bg-card/30 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Quick Actions
        </h3>
        <div className="flex gap-3">
            {children}
        </div>
    </div>
);

const UserListItem = ({ user, onSendClick }) => (
    <div onClick={() => onSendClick(user)} className="group flex items-center justify-between p-3 rounded-xl hover:bg-card/50 transition-all duration-200 border border-transparent hover:border-border/30">
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="ring-2 ring-background">
                    <AvatarFallback className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold">
                        {user.fullname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div>
                <p className="font-semibold text-foreground">{user.fullname}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
        </div>
        <Button 
            size="sm" 
            onClick={() => onSendClick(user)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20"
        >
            <Send className="h-4 w-4 mr-1" />
            Send
        </Button>
    </div>
);

const SearchSection = ({ searchQuery, setSearchQuery, users, isSearching, onUserSelect }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Send className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Send Money</h2>
        </div>
        
        <div className="bg-card/20 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by name or email..."
                    className="pl-12 h-12 text-base bg-background/50 border-border/30 focus:border-primary/50 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
                {isSearching ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            Searching...
                        </div>
                    </div>
                ) : users.length > 0 ? (
                    <>
                        <p className="text-sm text-muted-foreground mb-3 px-1">
                            {users.length} user{users.length !== 1 ? 's' : ''} found
                        </p>
                        {users.map((user) => (
                            <UserListItem key={user._id} user={user} onSendClick={onUserSelect} />
                        ))}
                    </>
                ) : searchQuery ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-3">
                            <Search className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground font-medium">No users found</p>
                        <p className="text-sm text-muted-foreground/70">Try a different name or email</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                            <Send className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-muted-foreground font-medium">Start typing to search</p>
                        <p className="text-sm text-muted-foreground/70">Enter a name or email to find users</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [balance, setBalance] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { accessToken, user: currentUser } = useAuthStore();
    const debounceTimeout = useRef(null);

      const fetchBalance = useCallback(async (retries = 3) => {
        if (!accessToken) return;
        try {
            const response = await api.get("/account/balance");
            if (typeof response.data.balance === "number") {
                setBalance(response.data.balance);
            }
        } catch (error) {
            console.error('Balance fetch attempt failed:', error);
            if (retries > 0) {
                console.log(`Retrying balance fetch... ${retries} attempts left.`);
                setTimeout(() => fetchBalance(retries - 1), 2000); // Wait 2s and retry
            } else {
                toast.error("Could not fetch balance after several attempts.");
            }
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
                console.error('Search error:', error);
                toast.error("Failed to search users");
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [searchQuery, currentUser._id]);

 
    
    const handleTransfer = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (Number(amount) > balance) {
            toast.error("Insufficient balance");
            return;
        }

        setIsTransferring(true);
        const toastId = toast.loading("Processing transfer...");
        
        try {
            await api.post("/account/transfer", { 
                to: selectedUser._id, 
                amount: Number(amount) 
            });
            
            toast.success(`₹${Number(amount).toLocaleString('en-IN')} sent to ${selectedUser.fullname}`, { id: toastId });
            await fetchBalance();
            setSelectedUser(null);
            setAmount("");
        } catch (error) {
            console.error('Transfer error:', error);
            toast.error(error.response?.data?.message || "Transfer failed", { id: toastId });
        } finally {
            setIsTransferring(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
            <Toaster position="top-center" />
            
            {/* Header Section */}
            <div className="flex flex-col space-y-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        Welcome back, {currentUser?.fullname?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage your finances with ease</p>
                </div>

                {/* Balance and Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Balance value={balance} />
                    </div>
                    <div>
                        <QuickActions>
                            <AddMoneyDialog onPaymentSuccess={fetchBalance}>
                                <Button className="flex-1 h-12 bg-gradient-to-r from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Money
                                </Button>
                            </AddMoneyDialog>
                            <WithdrawDialog onWithdrawSuccess={fetchBalance}>
                                <Button className="flex-1 h-12 bg-gradient-to-r from-red-500/10 to-red-500/5 hover:from-red-500/20 hover:to-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                                    <Minus className="h-4 w-4 mr-2" />
                                    Withdraw
                                </Button>
                            </WithdrawDialog>
                        </QuickActions>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <SearchSection 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        users={users}
                        isSearching={isSearching}
                        onUserSelect={setSelectedUser}
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                    </div>
                    <div className="bg-card/20 rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden">
                        <RecentTransactions />
                    </div>
                </div>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-md border-border/50 backdrop-blur-sm bg-background/95">
                    <DialogHeader className="text-center space-y-3">
                        <DialogTitle className="text-2xl font-bold">Send Money</DialogTitle>
                        <DialogDescription className="text-base">
                            Transfer funds to {selectedUser?.fullname}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6 space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-card/30 rounded-xl border border-border/30">
                            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                                <AvatarFallback className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                                    {selectedUser?.fullname.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">{selectedUser?.fullname}</p>
                                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-foreground">Amount to send</label>
                                <p className="text-xs text-muted-foreground">
                                    Available: ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                                <Input 
                                    type="text"
                                    placeholder="0.00"
                                    className="pl-8 h-12 text-lg font-semibold bg-background/50 border-border/30 focus:border-primary/50 rounded-xl"
                                    value={amount} 
                                    onChange={handleAmountChange}
                                    max={balance}
                                />
                            </div>
                            {amount && Number(amount) > balance && (
                                <p className="text-sm text-red-500">Amount exceeds available balance</p>
                            )}
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <div className="w-full space-y-3">
                            <Button 
                                onClick={handleTransfer} 
                                disabled={isTransferring || !amount || Number(amount) <= 0 || Number(amount) > balance} 
                                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl disabled:opacity-50"
                            >
                                {isTransferring ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send ₹{amount || '0'}
                                    </>
                                )}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setSelectedUser(null);
                                    setAmount("");
                                }}
                                className="w-full h-10 text-sm border-border/50 hover:bg-card/30"
                                disabled={isTransferring}
                            >
                                Cancel
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DashboardPage;
