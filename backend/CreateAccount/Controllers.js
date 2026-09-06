const db = require("../dbConnection");
const bcrypt = require('bcryptjs');

const generateBONumber = async () => {
    let boNumber;
    let exists = true;

    while (exists) {
        boNumber = `${Math.floor(100000 + Math.random() * 900000)}`;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE bo_number = ?",
            [boNumber]
        );

        exists = rows.length > 0;
    }

    return boNumber;
};

const createborrowerPersonals = async (req, res) => {
    try {
        const { fullName, phone, dob, email, gender, address, city, state, pincode, aadharNum, password } = req.body;

        if (!fullName || !phone || !dob || !email || !gender || !address || !city || !state || !pincode || !aadharNum || !password) {
            return res.status(400).json({ status: false, message: [{ description: "Something went wrong, Bad Request" }] });
        }

        const [existing] = await db.query("SELECT * FROM personal_details WHERE email = ?", [email]);
        const [userExist] = await db.query("SELECT * FROM users WHERE email = ? OR mobile = ?", [email,phone]);
        if (existing.length > 0) {
            return res.status(200).json({ status: false, message: [{ description: "Email already exists,Please try with another email" }] });
        }
        if (userExist.length > 0) {
            if (userExist[0].mobile === phone) {
                return res.status(200).json({
                    status: false,
                    message: [{ description: "Mobile number already exists." }]
                });
            }

            if (userExist[0].email === email) {
                return res.status(200).json({
                    status: false,
                    message: [{ description: "Email already exists." }]
                });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const boNumber = await  generateBONumber();        
    
        const [result] = await db.query(
            "INSERT INTO personal_details (fullName, phone, dob, email, gender, address,city,state,pincode,aadhar_number,bo_number,isFilled) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [fullName, phone, dob, email, gender, address, city, state, pincode, aadharNum,boNumber,"Y"]
        );
        const [userResult] = await db.query(
            "INSERT INTO users (full_name, mobile, email, password, status,bo_number) VALUES (?,?,?,?,?,?)",
            [fullName, phone, email, hashedPassword, "Y",boNumber]
        );
        res.setHeader("bocode", String(boNumber));
        return res.status(200).json({
            status: true,
            message: [{ description: "Personal Details Created Successfully." }]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const createBorrowerBanksDtls = async (req, res) => {
    try {
        const { bankName, accountHolder, accountNumber, ifcsCode, barchName } = req.body;
        const boNumber = req?.headers["bocode"];

        if (!bankName || !accountHolder || !accountNumber || !ifcsCode || !boNumber) {
            return res.status(400).json({ status: false, message: [{ description: "Something went wrong, Bad Request" }] });
        }

        const [result] = await db.query(
            "INSERT INTO bank_details (bank_name, account_holder, account_number, ifsc_code, branch_name,bo_number,isFilled) VALUES (?,?,?,?,?,?,?)",
            [bankName, accountHolder, accountNumber, ifcsCode, barchName,boNumber,"Y"]
        );
        res.setHeader("bocode", String(boNumber));
        return res.status(200).json({
            status: true,
            message: [{ description: "Bank Details Created Successfully." }],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const createBorrowerStudents = async (req, res) => {
    try {
        const { collegeName, branchName, yearofStudy, studentIdNum, university } = req.body;
        const boNumber = req?.headers["bocode"];
        if (!collegeName || !branchName || !yearofStudy || !studentIdNum || !university || !boNumber) {
            return res.status(400).json({ status: false, message: [{ description: "Something went wrong, Bad Request" }] });
        }

        const [result] = await db.query(
            "INSERT INTO student_details (university, college_name, branch_name, year_of_study, student_id_number,bo_number,isFilled) VALUES (?,?,?,?,?,?,?)",
            [university, collegeName, branchName, yearofStudy, studentIdNum,boNumber,"Y"]
        );
        res.setHeader("bocode", String(boNumber));
        return res.status(200).json({
            status: true,
            message: [{ description: "Student Details Created Successfully." }],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const storeDocuments = async (req, res) => {
    try {

        if (
            !req.files.aadharImage ||
            !req.files.accountBookImage ||
            !req.files.studentIdCardImage
        ) {
            return res.status(400).json({
                status: false,
                message: "All documents are required."
            });
        }

        const aadharImage = req.files.aadharImage[0].filename;
        const accountBookImage = req.files.accountBookImage[0].filename;
        const studentIdCardImage = req.files.studentIdCardImage[0].filename;
        const boNumber = req?.headers["bocode"];
        if(!boNumber){
            return res.status(400).json({ status: false, message: [{ description: "Something went wrong, Bad Request" }] });
        }

        await db.query(
            `INSERT INTO documents
            (aadhar_image, account_book_image, student_id_card_image,verified,bo_number,isFilled)
            VALUES (?, ?, ?, ?, ?,?)`,
            [
                aadharImage,
                accountBookImage,
                studentIdCardImage,
                "N",
                boNumber,
                "Y"
            ],
        );
        res.setHeader("bocode", String(boNumber));
        return res.status(201).json({
            status: true,
            message: "Documents uploaded successfully."
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

const selectQuery = async (db, table, bocode) => {
    const [rows] = await db.query(
        `SELECT * FROM ${table} WHERE bo_number = ?`,
        [bocode]
    );
    return rows;
};

const notifications = async (req, res) => {
    const bocode = req.headers["bocode"];
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
            success: true,
            data: response,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const inActivedemployeeList = async (req, res) => {
    try {
        const [employees] = await db.query(
            "SELECT id, name, email, department, role, salary FROM employees WHERE isActive = 'N' ORDER BY id DESC"
        );
        return res.status(200).json({
            status: true,
            totalEmployees: employees.length,
            employees: employees
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id, name, email, department, role, salary } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: [{ description: "Employee ID is required" }] });
        }

        const [result] = await db.query(
            "UPDATE employees SET name = ?, email = ?, department = ?, role = ?, salary = ? WHERE id = ?",
            [name, email, department, role, salary, id]
        );

        if (result.affectedRows === 0) {
            return res.status(200).json({ status: false, message: [{ description: "Employee not found" }] });
        }

        return res.status(200).json({ status: true, message: [{ description: "Employee updated successfully." }] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: [{ description: "Employee ID is required" }] });
        }

        // Soft delete, consistent with isActive flag convention
        const [result] = await db.query("UPDATE employees SET isActive = 'N' WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(200).json({ status: false, message: [{ description: "Employee not found" }] });
        }

        return res.status(200).json({ status: true, message: [{ description: "Employee deleted successfully." }] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const activedEmployee = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: [{ description: "Employee ID is required" }] });
        }

        const [result] = await db.query(
            "UPDATE employees SET isActive = ? WHERE id = ?",
            ["Y", id]
        );

        if (result.affectedRows === 0) {
            return res.status(200).json({ status: false, message: [{ description: "Employee not found" }] });
        }

        return res.status(200).json({ status: true, message: [{ description: "Employee Actived successfully." }] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

module.exports = { createborrowerPersonals, createBorrowerBanksDtls, createBorrowerStudents, storeDocuments, updateEmployee, deleteEmployee, activedEmployee };
