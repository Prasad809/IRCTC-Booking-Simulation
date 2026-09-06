const db = require("../dbConnection");
const dayjs = require("dayjs");
const transporter = require("../NodeMailer/mailTransporter")


const selectQuery = async (db, table, bocode) => {
    const [rows] = await db.query(
        `SELECT * FROM ${table} WHERE bo_number = ?`,
        [bocode]
    );
    return rows;
};

const otpStore = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(200).json({
                status: false,
                 message: [{ description: "Email is required" }]
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // OTP expires after 1 minutes
        const expiresAt = Date.now() + 1 * 60 * 1000;

        // Store OTP
        otpStore.set(email, {
            otp,
            expiresAt
        });

        // Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Verification Code",

            text: `Your OTP is ${otp}. This OTP will expire in 1 minutes.`,

            html: `
                <div style="
                    font-family: Arial;
                    max-width: 500px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                ">

                    <h2>OTP Verification</h2>

                    <p>Your verification code is:</p>

                    <h1 style="
                        letter-spacing: 8px;
                        text-align: center;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP is valid for <b>2 minutes</b>.
                    </p>

                    <p>
                        If you did not request this OTP,
                        please ignore this email.
                    </p>

                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({
            status: true,
            count: 60,
            message: [{ description:"OTP sent successfully" }]
        });

    } catch (error) {
        console.error("Send OTP error:", error);

        return res.status(500).json({
            status: false,
            message: [{ description: "Failed to send OTP" }]
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(200).json({
                status: false,
                message: [{ description: "Email and OTP are required" }]
            });
        }

        // Get stored OTP
        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(200).json({
                status: false,
                message: [{ description: "OTP not found or already used" }] 
            });
        }

        // Check expiry
        if (Date.now() > storedData.expiresAt) {

            // Delete expired OTP
            otpStore.delete(email);

            return res.status(200).json({
                status: false,
                message: [{ description: "OTP has expired" }]
            });
        }

        // Check OTP
        if (storedData.otp !== otp.toString()) {
            return res.status(200).json({
                status: false,
                message: [{ description: "Invalid OTP" }]
            });
        }

        // OTP is correct
        otpStore.delete(email);

        return res.status(200).json({
            status: true,
            message: [{ description: "OTP verified successfully"}]
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            status: false,
            message: [{ description: "OTP verification failed" }]
        });
    }
};

const notifications = async (req, res) => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;
    try {
        const personalNotify = await selectQuery(db, "personal_details", bocode);
        const studentNotify = await selectQuery(db, "student_details", bocode);
        const bankNotify = await selectQuery(db, "bank_details", bocode);
        const documentNotify = await selectQuery(db, "documents", bocode);

        const response = {
            personal: personalNotify.length > 0 ? "Completed" : "Pending",
            student: studentNotify.length > 0 ? "Completed" : "Pending",
            bank: bankNotify.length > 0 ? "Completed" : "Pending",
            documents: documentNotify.length > 0 ? "Completed" : "Pending",
        };

        return res.status(200).json({
            status: true,
            data: response,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { email } = req.body;

        const [user] = await db.query(
            "SELECT bo_number FROM users WHERE email = ?",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const bo_number = user[0].bo_number;

        const [personal] = await db.query(
            `SELECT
                fullName,
                phone AS mobile,
                email,
                DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
                gender,
                address,
                city,
                state,
                pincode,
                aadhar_number AS aadhaar
            FROM personal_details
            WHERE bo_number = ?`,
            [bo_number]
        );

        const [bank] = await db.query(
            `SELECT
                bank_name AS bankName,
                account_holder AS accountHolderName,
                account_number AS accountNumber,
                ifsc_code AS ifscCode,
                branch_name As branch
            FROM bank_details
            WHERE bo_number = ?`,
            [bo_number]
        );

        const [student] = await db.query(
            `SELECT 
                college_name as collegeName,
                student_id_number as studentId,
                branch_name as course,
                year_of_study as year,
                university as university
            FROM student_details 
            WHERE bo_number = ?`,
            [bo_number]
        );

        const [documents] = await db.query(
            "SELECT * FROM documents WHERE bo_number = ?",
            [bo_number]
        );

        res.status(200).json({
            status: true,
            data: {
                personal: personal[0] || {},
                bank: bank[0] || {},
                student: student[0] || {},
                documents: documents[0] || {}
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};


const updatePersonalDetails = async (req, res) => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;

    try {
        const {
            fullName,
            phone,
            dob,
            email,
            gender,
            address,
            city,
            state,
            pincode
        } = req.body;

        await db.query(
            `UPDATE personal_details
             SET fullName = ?,
                 phone = ?,
                 dob = ?,
                 email = ?,
                 gender = ?,
                 address = ?,
                 city = ?,
                 state = ?,
                 pincode = ?
             WHERE bo_number = ?`,
            [
                fullName,
                phone,
                dob,
                email,
                gender,
                address,
                city,
                state,
                pincode,
                bocode
            ]
        );

        res.json({
            status: true,
            message: "Personal details updated successfully."
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

const updateBankDetails = async (req, res) => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;

    try {
        const {
            bankName,
            accountHolderName,
            accountNumber,
            ifscCode,
            branch
        } = req.body;

        await db.query(
            `UPDATE bank_details
             SET bankName = ?,
                 accountHolderName = ?,
                 accountNumber = ?,
                 ifscCode = ?,
                 branch = ?
             WHERE bo_number = ?`,
            [
                bankName,
                accountHolderName,
                accountNumber,
                ifscCode,
                branch,
                bocode
            ]
        );

        res.json({
            status: true,
            message: "Bank details updated successfully."
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};


const updateStudentDetails = async (req, res) => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;

    try {
        const {
            collegeName,
            branchName,
            yearofStudy,
            studentIdNum,
            university
        } = req.body;

        await db.query(
            `UPDATE student_details
             SET collegeName = ?,
                 branchName = ?,
                 yearofStudy = ?,
                 studentIdNum = ?,
                 university = ?
             WHERE bo_number = ?`,
            [
                collegeName,
                branchName,
                yearofStudy,
                studentIdNum,
                university,
                bocode
            ]
        );

        res.json({
            status: true,
            message: "Student details updated successfully."
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

const updateDocuments = async (req, res) => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;

    try {
        await db.query(
            `UPDATE documents
             SET aadharImage = ?,
                 bankBook = ?,
                 studentIdCard = ?
             WHERE bo_number = ?`,
            [
                req.files?.aadharImage?.[0]?.filename,
                req.files?.bankBook?.[0]?.filename,
                req.files?.studentIdCard?.[0]?.filename,
                bocode
            ]
        );

        res.json({
            status: true,
            message: "Documents updated successfully."
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};


module.exports = { notifications, getUserDetails, sendOtp, verifyOtp }