import db from "../config/db.js";
import { generateOtp } from "../utils/otpHelper.js";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

//sending OTP to user's phone number
export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60000); // OTP valid for 5 minutes

        await db.execute("INSERT INTO otps (phone, otp, expires_at) VALUES (?, ?, ?)", [phone, otp, expiresAt]);

        await client.messages.create({
            from: process.env.TWILIO_PHONE,
            to: `whatsapp:${phone}`,
            body: `Your OTP is ${otp}. It is valid for 5 minutes.`
        });

        res.json({ success: true, msg: "OTP sent" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


//verifying the OTP 
export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const [rows] = await db.execute("SELECT * FROM otps WHERE phone=? AND otp=? AND expires_at > NOW()", [phone, otp]);

        if (!rows.length) return res.json({ success: false, msg: "Invalid OTP" });

        const [user] = await db.execute("SELECT * FROM users WHERE phone=?", [phone]);

        if (user.length) {
            const { first_name, last_name, email, dob } = user[0];
            return res.json({ success: true, exists: true, user: { first_name, last_name, email, dob } });
        } else {
            return res.json({ success: true, exists: false });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


export const registerUser = async (req, res) => {
    try {
        const { phone, firstName, lastName, email, dob } = req.body;

        await db.execute(
            "INSERT INTO users (phone, first_name, last_name, email, dob) VALUES (?, ?, ?, ?, ?)",
            [phone, firstName, lastName, email, dob]
        );

        // Fetch the newly registered user
        const [user] = await db.execute("SELECT * FROM users WHERE phone=?", [phone]);

        res.json({ success: true, msg: "Successfully registered", user: user[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

