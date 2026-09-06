const db = require("../dbConnection");

const getPendingDocuments = async (req, res) => {

    try {

        const [rows] = await db.query(
            `SELECT
                d.document_id,
                d.bo_number,
                d.aadhar_image,
                d.account_book_image,
                d.student_id_card_image,
                d.verified,
                p.fullName,
                p.phone,
                p.email
            FROM documents d
            INNER JOIN personal_details p
                ON d.bo_number = p.bo_number
            WHERE d.verified = 'N'
            ORDER BY d.document_id DESC`
        );

        return res.json({
            status: true,
            documents: rows
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });

    }
};

const verifyDocuments = async (req, res) => {
    try {
        const { bo_number } = req.body;
        await db.query(
            `UPDATE documents
                SET
                verified='Y'
                WHERE bo_number=?`,
            [bo_number]
        );

        return res.json({

            status: true,

            message: "Documents Verified Successfully"

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = { getPendingDocuments,verifyDocuments };