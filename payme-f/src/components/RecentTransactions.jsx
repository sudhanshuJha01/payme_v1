import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/account/history');
                setTransactions(response.data.transactions.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch transaction history:", error);
            }
        };
        fetchHistory();
    }, []);

    const getTransactionDetails = (tx) => {
        const isCredit = tx.receiverId._id === user._id;
        let details, amountStyle, amountSign, otherParty;

        if (tx.type === 'deposit') {
            details = "Added to Wallet";
            otherParty = { email: "From your bank" };
            amountStyle = "text-green-500";
            amountSign = "+ ";
        } else if (tx.type === 'withdrawal') {
            details = "Withdrawn to Bank";
            otherParty = { email: "To your bank" };
            amountStyle = "text-red-500";
            amountSign = "- ";
        } else if (isCredit) {
            details = `Received from: ${tx.senderId.fullname}`;
            otherParty = tx.senderId;
            amountStyle = "text-green-500";
            amountSign = "+ ";
        } else { // Sent
            details = `Sent to: ${tx.receiverId.fullname}`;
            otherParty = tx.receiverId;
            amountStyle = "text-red-500";
            amountSign = "- ";
        }
        return { details, amountStyle, amountSign, otherParty };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map((tx) => {
                                const { details, amountStyle, amountSign, otherParty } = getTransactionDetails(tx);
                                return (
                                    <TableRow key={tx._id}>
                                        <TableCell>
                                            <div className="font-medium">{details}</div>
                                            <div className="text-sm text-muted-foreground">{otherParty.email}</div>
                                        </TableCell>
                                        <TableCell className={`text-right font-semibold ${amountStyle}`}>
                                            {amountSign}₹{tx.amount.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    No recent transactions.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" className="w-full">
                    <Link to="/history">View All Transactions</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default RecentTransactions;