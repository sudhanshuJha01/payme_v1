import Razorpay from "razorpay";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";
import { Beneficiary } from "../models/beneficiary.model.js";

const razorpayX = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

/**
 * @desc Add a beneficiary bank account and save it to the database
 */

export const addBankAccount = async (req, res) => {
  try {
    const { name, ifsc, account_number, nickname } = req.body;
    const userId = req.userId;

    if (!name || !ifsc || !account_number || !nickname) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "All fields (name, ifsc, account number, nickname) are required.",
        });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Step 1: Create a Contact in RazorpayX
    const contact = await razorpayX.contacts.create({
      name: user.fullname,
      email: user.email,
      contact: "9999999999",
      type: "customer",
      reference_id: userId.toString(),
    });

    // Step 2: Create the Fund Account with RazorpayX
    const fundAccount = await new Promise((resolve, reject) => {
      razorpayX.fundAccount.create(
        {
          contact_id: contact.id,
          account_type: "bank_account",
          bank_account: {
            name: name,
            ifsc: ifsc,
            account_number: account_number,
          },
        },
        (error, account) => {
          if (error) {
            return reject(error);
          }
          resolve(account);
        }
      );
    });

    // Step 3: SAVE THE BENEFICIARY TO YOUR OWN DATABASE
    const newBeneficiary = await Beneficiary.create({
      userId: userId,
      fundAccountId: fundAccount.id,
      name: fundAccount.bank_account.name,
      nickname: nickname,
      accountInfo: `${
        fundAccount.bank_account.bank_name
      } ending in ${account_number.slice(-4)}`,
    });

    res.status(201).json({
      success: true,
      message: "Beneficiary added successfully.",
      beneficiary: newBeneficiary,
    });
  } catch (error) {
    console.error(
      "Add Bank Account Error:",
      error.error?.description || error.message
    );
    return res
      .status(500)
      .json({
        success: false,
        message: error.error?.description || "Internal Server Error",
      });
  }
};

/**
 * @desc Get all saved beneficiaries for the logged-in user
 */

export const getBeneficiaries = async (req, res) => {
  try {
    const userId = req.userId;
    const beneficiaries = await Beneficiary.find({ userId: userId });

    return res.status(200).json({
      success: true,
      beneficiaries,
    });
  } catch (error) {
    console.error("Get Beneficiaries Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * @desc Initiate a payout (withdrawal) to a linked bank account
 */

export const initiatePayout = async (req, res) => {
    // Start a Mongoose session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fund_account_id, amount } = req.body;
        const userId = req.userId;

        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "A positive withdrawal amount is required.",
            });
        }

        // Check the user's wallet balance within the transaction
        const userAccount = await Account.findOne({ userId }).session(session);
        if (!userAccount || userAccount.balance < parsedAmount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance."
            });
        }

        // --- External API Call ---
        // Create the Payout with Razorpay
        const payout = await razorpayX.payouts.create({
            account_number: process.env.RAZORPAYX_TEST_ACCOUNT_NUMBER,
            fund_account_id: fund_account_id,
            amount: parsedAmount * 100, // Amount in paise
            currency: "INR",
            mode: "IMPS",
            purpose: "payout",
            narration: "Payme wallet withdrawal",
        });

        // If the payout fails, Razorpay's library will throw an error,
        // which will be caught by the catch block, and the transaction will be aborted.

        // --- Internal Database Update ---
        // Debit the balance from the internal wallet
        await Account.updateOne(
            { userId },
            { $inc: { balance: -parsedAmount } }
        ).session(session);
        
        // If everything succeeds, commit the transaction
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: `Withdrawal of ₹${parsedAmount} initiated successfully.`,
            payout,
        });

    } catch (error) {
        // If any error occurs, roll back the database changes
        await session.abortTransaction();
        console.error(
            "Initiate Payout Error:",
            error.error?.description || error.message
        );
        return res.status(500).json({
            success: false,
            message: error.error?.description || "Internal Server Error",
        });
    } finally {
        // Always end the session
        session.endSession();
    }
};