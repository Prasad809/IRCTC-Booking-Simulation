const db = require("../dbConnection");

const getAvailableLoanPlans = async (req, res) => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;

    try {
        const [student] = await db.query(
            `SELECT *
         FROM student_details
         WHERE bo_number = ?`,
            [bocode]
        );

        if (student.length === 0) {
            throw new Error("Student details not found");
        }

        const [doc] = await db.query(
            `SELECT *
            FROM documents
            WHERE bo_number=?`,
            [bocode]
        );
        if (doc.length === 0) {
            return res.json({
                status: false,
                message: "Documents Not Uploaded"
            });
        }
        if (doc[0].verified !== "Y") {
            return res.json({
                status: false,
                message: "Your documents are pending verification."
            });
        }        
        const year = student[0].year_of_study;

        let loanTypes = [];

        switch (year) {
            case 1:
                loanTypes = [
                    "Books Loan",
                    "Hostel Fee Loan"
                ];
                break;
            case 2:
                loanTypes = [
                    "Books Loan",
                    "Exam Fee Loan"
                ];
                break;
            case 3:
                loanTypes = [
                    "Laptop Repair Loan",
                    "Online Course Loan"
                ];
                break;
            case 4:
                loanTypes = [
                    "Project Material Loan",
                    "Educational Tour Loan"
                ];
                break;

            default:
                loanTypes = [];
        }
        if (loanTypes.length === 0) {
            return [];
        }
        const placeholders = loanTypes.map(() => "?").join(",");

        const [plans] = await db.query(
            `SELECT *
        FROM loan_plans
        WHERE loan_name IN (${placeholders})
        AND status='Y'`,
            loanTypes
        );
        return res.status(200).json({
            status: true,
            loans: plans,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }

};

const applyLoan = async (req, res) => {
    try {

        const { email, loanType, loanAmt, purpose } = req.body;

        // Find User
        const [user] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const { user_id, bo_number } = user[0];

        // Find Loan Plan
        const [plan] = await db.query(
            `SELECT *
             FROM loan_plans
             WHERE loan_name=? AND status='Y'`,
            [loanType]
        );

        if (plan.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Loan plan not found"
            });
        }

        const loanPlan = plan[0];

        // Validate Amount
        if (loanAmt < loanPlan.min_amount || loanAmt > loanPlan.max_amount) {
            return res.status(400).json({
                status: false,
                message: `Loan amount should be between ${loanPlan.min_amount} and ${loanPlan.max_amount}`
            });
        }

        // Check Pending Loan
        const [pending] = await db.query(
            `SELECT loan_id
             FROM loans
             WHERE bo_number=?
             AND status='Pending'`,
            [bo_number]
        );

        if (pending.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Pending loan already exists"
            });
        }

        // Save Loan
        const [result] = await db.query(
            `INSERT INTO loans
            (
                user_id,
                loan_amount,
                loan_type,
                purpose,
                duration_months,
                interest_rate,
                status,
                bo_number
            )
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                user_id,
                loanAmt,
                loanType,
                purpose,
                loanPlan.tenure_months,
                loanPlan.interest_rate,
                "Pending",
                bo_number
            ]
        );

        return res.status(201).json({
            status: true,
            message: "Loan Applied Successfully",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });

    }
};

const payLoan = async (req, res) => {
    const connection = await db.getConnection();
    const [row] = await connection.query("SELECT * FROM users WHERE email = ?", [req.body.email])
    const bocode = row?.[0]?.bo_number;

    try {
        const {
            email,
            loan_id,
            payment_amount,
            payment_mode,
            remarks
        } = req.body;

        if (!email ||
            !loan_id ||
            !payment_amount ||
            !payment_mode) {
            return res.status(400).json({
                status: false,
                message: "All fields are required."
            });
        }

        await connection.beginTransaction();

        // Get Loan Details

        const [loan] = await connection.query(
            `SELECT
                loan_amount,
                total_interest,
                total_payable,
                total_paid,
                balance_amount
            FROM loans
            WHERE loan_id = ?
            AND bo_number = ?`,
            [loan_id, bocode]
        );

        if (loan.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                status: false,
                message: "Loan not found."
            });

        }

        const loanDetails = loan[0];

        if (payment_amount > loanDetails.balance_amount) {

            await connection.rollback();

            return res.status(400).json({
                status: false,
                message: "Payment exceeds remaining balance."
            });

        }

        // Insert Payment History

        await connection.query(
            `INSERT INTO loan_payment_history
            (
                loan_id,
                bo_number,
                payment_amount,
                payment_mode,
                remarks
            )
            VALUES (?,?,?,?,?)`,
            [
                loan_id,
                bocode,
                payment_amount,
                payment_mode,
                remarks || null
            ]
        );

        // Update Loan

        const totalPaid =
            Number(loanDetails.total_paid) +
            Number(payment_amount);

        const balance =
            Number(loanDetails.total_payable) -
            totalPaid;

        let paymentStatus = "Partial";

        if (balance <= 0) {
            paymentStatus = "Completed";
        }

        await connection.query(
            `UPDATE loans
            SET
                total_paid=?,
                balance_amount=?,
                payment_status=?
            WHERE loan_id=?`,
            [
                totalPaid,
                balance,
                paymentStatus,
                loan_id
            ]
        );

        await connection.commit();

        return res.status(200).json({

            status: true,

            message: "Payment Successful",

            payment: {

                total_paid: totalPaid,

                balance_amount: balance,

                payment_status: paymentStatus

            }

        });

    } catch (error) {

        await connection.rollback();

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Internal Server Error"

        });

    } finally {

        connection.release();

    }

};

const getLoanSummary = async (req, res) => {

    try {

        const { bo_number } = req.body;

        const [rows] = await db.query(

            `SELECT
                loan_id,
                loan_type,
                loan_amount,
                interest_rate,
                total_interest,
                total_payable,
                total_paid,
                balance_amount,
                payment_status
            FROM loans
            WHERE bo_number=?`,
            [bo_number]

        );

        return res.json({

            status: true,

            loans: rows

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Internal Server Error"

        });

    }

};

const getPaymentHistory = async (req, res) => {
    try {
        const { loan_id } = req.body;
        const [rows] = await db.query(
            `SELECT
                payment_id,
                payment_amount,
                payment_mode,
                payment_date,
                remarks
            FROM loan_payment_history
            WHERE loan_id=?
            ORDER BY payment_date DESC`,
            [loan_id]
        );
        return res.json({
            status: true,
            history: rows
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { getAvailableLoanPlans, applyLoan, payLoan, getLoanSummary, getPaymentHistory }