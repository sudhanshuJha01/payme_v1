import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

console.log("--- STARTING RAZORPAY TEST ---");

try {
    console.log("API Key loaded:", !!process.env.RAZORPAY_API_KEY);
    console.log("Secret loaded:", !!process.env.RAZORPAY_SECRET);
    
    console.log("\nInspecting the imported Razorpay object...");
    console.log("Type of 'Razorpay':", typeof Razorpay);
    console.log("Is 'Razorpay' a function (class)?", typeof Razorpay === 'function');
    
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    });

    console.log("\nRazorpay instance created successfully.");
    
    console.log("\nInspecting the instance properties...");
    console.log("Does instance.methods exist?", !!instance.methods);
    console.log("Does instance.contacts exist?", !!instance.contacts);
    console.log("Does instance.fundAccount exist?", !!instance.fundAccount);

    if (instance.methods) {
        console.log("\nAttempting to call a simple API...");
        instance.methods.all({}, (error, result) => {
            if (error) {
                console.error("\nAPI CALL FAILED (Callback Error):", error);
            } else {
                console.log("\nAPI CALL SUCCESSFUL!", result);
            }
            console.log("\n--- END OF RAZORPAY TEST ---");
        });
    } else {
        console.error("\nTEST FAILED: The '.methods' property does not exist on the Razorpay instance.");
        console.log("\n--- END OF RAZORPAY TEST ---");
    }
} catch (e) {
    console.error("\nA critical error occurred:", e);
    console.log("\n--- END OF RAZORPAY TEST ---");
}