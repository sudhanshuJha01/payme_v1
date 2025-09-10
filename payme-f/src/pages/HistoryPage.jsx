import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const HistoryPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/account/history');
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error("Failed to fetch transaction history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const renderTransactionRow = (tx) => {
        let type, details, amountStyle, amountSign, otherParty;
        const isCredit = tx.receiverId._id === user._id;

        if (tx.type === 'deposit') {
            type = "Deposit";
            details = "Added to Wallet";
            otherParty = { email: "From your bank" };
            amountStyle = "text-green-500";
            amountSign = "+ ";
        } else if (tx.type === 'withdrawal') {
            type = "Withdrawal";
            details = "Withdrawn to Bank";
            otherParty = { email: "To your bank" };
            amountStyle = "text-red-500";
            amountSign = "- ";
        } else if (isCredit) {
            type = "Credit";
            details = `Received from: ${tx.senderId.fullname}`;
            otherParty = tx.senderId;
            amountStyle = "text-green-500";
            amountSign = "+ ";
        } else { // Sent
            type = "Debit";
            details = `Sent to: ${tx.receiverId.fullname}`;
            otherParty = tx.receiverId;
            amountStyle = "text-red-500";
            amountSign = "- ";
        }

        return (
            <TableRow key={tx._id}>
                <TableCell>
                    <div className="font-medium">{type}</div>
                    <div className="text-sm text-muted-foreground">{details}</div>
                    <div className="text-xs text-muted-foreground">{otherParty.email}</div>
                </TableCell>
                <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className={`text-right font-semibold ${amountStyle}`}>
                    {amountSign}₹{tx.amount.toFixed(2)}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <div className="animate-popup">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A complete record of your account activity.</CardDescription>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Details</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
                        ) : transactions.length > 0 ? (
                            transactions.map(renderTransactionRow)
                        ) : (
                            <TableRow><TableCell colSpan={3} className="text-center">No transactions found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default HistoryPage;