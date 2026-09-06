const dbPool = require("../dbConnection");

const generatePNR = () => {
    const random = Math.floor(
        1000000000 + Math.random() * 9000000000
    );

    return String(random);
};

const generateTransactionId = () => {
    return (
        "TXN" +
        Date.now() +
        Math.floor(1000 + Math.random() * 9000)
    );
};

const confirmBooking = async (req, res) => {


    const connection = await dbPool.getConnection();

    try {
        const {
            userNameOrEmail,
            trainName,
            trainNo,
            source,
            destination,
            date,
            classCode,
            quota,
            passengers,
            fare,
            totalFare,
            paymentMethodType,
            // paymentMethodId,
            cardNumber,
            expiry,
            upiId
        } = req.body;


        // ==========================================
        // VALIDATE USER
        // ==========================================

        if (!userNameOrEmail) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Username or email is required"
                    }
                ]
            });
        }

        const [users] = await connection.query(
            `
            SELECT id, user_name, email
            FROM users
            WHERE user_name = ? OR email = ?
            LIMIT 1
            `,
            [userNameOrEmail, userNameOrEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "User not found"
                    }
                ]
            });
        }

        const userId = users[0].id;

        // ==========================================
        // VALIDATE TRAIN
        // ==========================================

        if (!trainNo) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Train number is required"
                    }
                ]
            });
        }

        const [trains] = await connection.query(
            `
            SELECT id, train_no, train_name
            FROM trains
            WHERE train_no = ?
            LIMIT 1
            `,
            [trainNo]
        );

        if (trains.length === 0) {
            return res.status(404).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Train not found"
                    }
                ]
            });
        }

        const trainId = trains[0].id;

        // ==========================================
        // VALIDATE BOOKING DETAILS
        // ==========================================

        if (
            !userId ||
            !trainId ||
            !date ||
            !classCode ||
            !quota
        ) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "Required booking details are missing"
                    }
                ]
            });
        }

        // ==========================================
        // VALIDATE PASSENGERS
        // ==========================================

        if (
            !Array.isArray(passengers) ||
            passengers.length === 0
        ) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "At least one passenger is required"
                    }
                ]
            });
        }

        if (passengers.length > 6) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "Maximum 6 passengers allowed per booking"
                    }
                ]
            });
        }

        if (!paymentMethodType ||
            !["CREDIT", "DEBIT", "UPI"].includes(
                String(paymentMethodType).toUpperCase()
            )
        ) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "Invalid payment method"
                    }
                ]
            });
        }




        // ==========================================
        // START TRANSACTION
        // ==========================================

        await connection.beginTransaction();

        // ==========================================
        // MOCK PAYMENT
        // ==========================================

        /*
         * Since card_number is no longer received
         * from frontend during booking, we simulate
         * payment failure using the saved masked card.
         *
         * Example:
         * XXXX XXXX XXXX 0000
         */

        if (String(paymentMethodType).toUpperCase() === "CARD" && String(cardNumber || "").endsWith("0000")) {
            await connection.rollback();
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "Payment failed"
                    }
                ]
            });
        }

        // ==========================================
        // GENERATE TRANSACTION ID
        // ==========================================

        const transactionId =
            generateTransactionId();

        // ==========================================
        // GENERATE UNIQUE PNR
        // ==========================================

        let pnr;
        let pnrExists = true;

        while (pnrExists) {
            pnr = generatePNR();

            const [existingPNR] =
                await connection.query(
                    `
                    SELECT id
                    FROM bookings
                    WHERE pnr = ?
                    LIMIT 1
                    `,
                    [pnr]
                );

            pnrExists =
                existingPNR.length > 0;
        }

        // ==========================================
        // INSERT BOOKING
        // ==========================================

        const [bookingResult] =
            await connection.query(
                `
                INSERT INTO bookings (
                    pnr,
                    user_id,
                    train_id,
                    journey_date,
                    class_code,
                    quota_code,
                    fare_per_seat,
                    total_fare,
                    status,
                    cardNumber,
                    UPI,
                    type,
                    expiry
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    pnr,
                    userId,
                    trainId,
                    date,
                    classCode,
                    quota,
                    Number(fare),
                    Number(totalFare),
                    "CONFIRMED",
                    cardNumber,
                    upiId,
                    paymentMethodType,
                    expiry
                ]
            );

        const bookingId = bookingResult.insertId;

        //seat 

        const passengerCount = passengers.length;

        if (passengerCount <= 0) {
            return res.status(400).json({
                status: false,
                message: [
                    {
                        descrption: "Passenger details are required"
                    }
                ]
            });
        }
        const [inventoryRows] = await connection.query(
            `
                SELECT
                    id,
                    total_seats,
                    available_seats,
                    booked_seats
                FROM seat_inventory
                WHERE train_id = ?
                AND journey_date = ?
                AND class_code = ?
                AND quota_code = ?
                AND isActive = 'Y'
                FOR UPDATE
                `,
            [
                trainId,
                date,
                classCode,
                quota
            ]
        );

        if (inventoryRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: false,
                message: [
                    {
                        descrption: "Seat inventory not found"
                    }
                ]
            });
        }

        const inventory = inventoryRows[0];

        /*
         * 2. Check availability
         */
        if (inventory.available_seats < passengerCount) {
            await connection.rollback();

            return res.status(400).json({
                status: false,
                message: [
                    {
                        descrption: `Only ${inventory.available_seats} seats are available`
                    }
                ]
            });
        }

        await connection.query(
            `
            UPDATE seat_inventory
            SET
                available_seats = available_seats - ?,
                booked_seats = booked_seats + ?
            WHERE id = ?
              AND available_seats >= ?
            `,
            [
                passengerCount,
                passengerCount,
                inventory.id,
                passengerCount
            ]
        );

        // ==========================================
        // INSERT BOOKING PASSENGERS
        // ==========================================

        for (const passenger of passengers) {
            if ( !passenger.name?.trim() || !passenger.age || Number(passenger.age) <= 0 || !passenger.gender?.trim()) {
                throw new Error("Invalid passenger details");
            }

            let passengerMasterId = null;

            /*
             * Saved passenger:
             * 123
             *
             * Temporary passenger:
             * TMP-123456
             */

            if (passenger.id &&!String(passenger.id).startsWith("TMP-")) {
                passengerMasterId = String(passenger.id);
            }

            await connection.query(
                `
                INSERT INTO booking_passengers (
                    booking_id,
                    passenger_master_id,
                    name,
                    age,
                    gender,
                    berth_preference,
                    seat_number
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    bookingId,
                    passengerMasterId,
                    passenger.name.trim(),
                    Number(passenger.age),
                    String(
                        passenger.gender
                    ).toUpperCase(),
                    passenger.berthPreference ||
                    "No Preference",
                    null
                ]
            );
        }

        // ==========================================
        // INSERT PAYMENT
        // ==========================================

        const [paymentResult] =
            await connection.query(
                `
                INSERT INTO payments (
                    booking_id,
                    amount,
                    method_type,
                    transaction_id,
                    status,
                    reason
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    bookingId,
                    Number(totalFare),
                    String(
                        paymentMethodType
                    ).toUpperCase(),
                    transactionId,
                    "SUCCESS",
                    null
                ]
            );


        const paymentId = paymentResult.insertId;


        // ==========================================
        // COMMIT TRANSACTION
        // ==========================================

        await connection.commit();

        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({
            status: true,

            lookUpData: {
                bookingId,
                pnr,
                transactionId,
                paymentId,
                userId,
                trainId,
                trainName,
                trainNo,
                source,
                destination,
                date: date,
                classCode,
                quota,
                passengers,
                fare: Number(fare),
                totalFare: Number(totalFare),
                paymentMethodLabel: paymentMethodType,
                paymentStatus: "SUCCESS",
                status: "CONFIRMED"
            },

            message: [
                {
                    descrption:
                        "Payment successful and booking confirmed"
                }
            ]
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "confirmBooking error:",
            error
        );

        return res.status(500).json({
            status: false,
            lookUpData: [],
            message: [
                {
                    descrption:
                        "Payment or booking failed"
                }
            ]
        });

    } finally {

        connection.release();
    }
};


const getMyBookings = async (req, res) => {
    try {
        const {
            userNameOrEmail,
            role
        } = req.body;
        if (!userNameOrEmail) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Username or email is required"
                    }
                ]
            });
        }

        /*
         * 1. Find user
         */
        const [users] = await dbPool.query(
            `
            SELECT
                *
            FROM users
            WHERE user_name = ?
               OR email = ?
            LIMIT 1
            `,
            [
                userNameOrEmail,
                userNameOrEmail
            ]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                message: [
                    {
                        descrption: "User not found"
                    }
                ]
            });
        }

        const user = users[0];

        const userId = user.id;

        /*
         * Use database role instead of trusting req.body role
         */
        const userRole = String(user.role || "").toUpperCase();

        /*
         * 2. Get bookings
         *
         * ADMIN  -> all bookings
         * USER   -> only his/her bookings
         */

        let bookingQuery = `
            SELECT
                b.id AS bookingId,
                b.pnr,
                b.user_id AS userId,
                u.user_name AS userName,
                u.email AS userEmail,

                b.train_id AS trainId,

                t.train_name AS trainName,
                t.train_no AS trainNo,
                t.source,
                t.destination,

                DATE_FORMAT(
                    b.journey_date,
                    '%Y-%m-%d'
                ) AS date,

                b.class_code AS classCode,
                b.quota_code AS quota,
                b.total_fare AS totalFare,
                b.status,
                DATE_FORMAT(
                    b.created_at,
                    '%Y-%m-%d %H:%i:%s'
                ) AS bookingDate

            FROM bookings b

            INNER JOIN trains t
                ON t.id = b.train_id

            INNER JOIN users u
                ON u.id = b.user_id
        `;

        const queryParams = [];

        /*
         * Normal user:
         * only his bookings
         */
        if (userRole !== "ADMIN") {
            bookingQuery += `
                WHERE b.user_id = ?
            `;

            queryParams.push(userId);
        }

        /*
         * Latest bookings first
         */
        bookingQuery += `
            ORDER BY b.created_at DESC
        `;

        const [bookingRows] = await dbPool.query(
            bookingQuery,
            queryParams
        );

        /*
         * 3. Get passengers for every booking
         */
        for (const booking of bookingRows) {

            const [passengerRows] = await dbPool.query(
                `
                SELECT
                    id,
                    passenger_master_id AS passengerId,
                    name,
                    age,
                    gender,
                    berth_preference AS berthPreference
                FROM booking_passengers
                WHERE booking_id = ?
                ORDER BY id
                `,
                [
                    booking.bookingId
                ]
            );

            booking.passengers = passengerRows;

            /*
             * Passenger count from actual passenger records
             */
            booking.passengerCount = passengerRows.length;
        }

        /*
         * 4. Response
         */
        return res.status(200).json({
            status: true,
            lookUpData: bookingRows,
            message: [
                {
                    descrption:
                        userRole === "ADMIN"
                            ? "All bookings fetched successfully"
                            : "Bookings fetched successfully"
                }
            ]
        });

    } catch (error) {

        console.error(
            "getMyBookings error:",
            error
        );

        return res.status(500).json({
            status: false,
            lookUpData: [],
            message: [
                {
                    descrption: "Failed to fetch bookings"
                }
            ]
        });
    }
};


const cancelBooking = async (req, res) => {

    const connection = await dbPool.getConnection();

    try {

        const {
            pnr,
            userNameOrEmail
        } = req.body;

        // --------------------------------------------------
        // 1. Validate request
        // --------------------------------------------------

        if (!pnr || !userNameOrEmail) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "PNR and UserName Or Email are required"
                    }
                ]
            });
        }

        // --------------------------------------------------
        // 2. Find user
        // --------------------------------------------------

        const [users] = await connection.query(
            `
            SELECT
                id,
                user_name,
                email
            FROM users
            WHERE user_name = ?
               OR email = ?
            LIMIT 1
            `,
            [
                userNameOrEmail,
                userNameOrEmail
            ]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "User not found"
                    }
                ]
            });
        }

        const userId = users[0].id;

        // --------------------------------------------------
        // 3. Start transaction
        // --------------------------------------------------

        await connection.beginTransaction();

        // --------------------------------------------------
        // 4. Get booking
        // --------------------------------------------------

        const [bookingRows] = await connection.query(
            `
            SELECT
                id,
                pnr,
                user_id,
                train_id,
                journey_date,
                class_code,
                quota_code,
                total_fare,
                status,
                created_at
            FROM bookings
            WHERE pnr = ?
              AND user_id = ?
            LIMIT 1
            FOR UPDATE
            `,
            [
                pnr,
                userId
            ]
        );

        if (bookingRows.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Booking not found"
                    }
                ]
            });
        }

        const booking = bookingRows[0];


        // --------------------------------------------------
        // 5. Check booking status
        // --------------------------------------------------

        if (booking.status !== "CONFIRMED") {

            await connection.rollback();

            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "This booking is already cancelled"
                    }
                ]
            });
        }

        // --------------------------------------------------
        // 6. Get passengers
        // --------------------------------------------------

        const [passengerRows] = await connection.query(
            `
            SELECT
                id,
                passenger_master_id AS passengerId,
                name,
                age,
                gender,
                berth_preference AS berthPreference
            FROM booking_passengers
            WHERE booking_id = ?
            `,
            [
                booking.id
            ]
        );

        // --------------------------------------------------
        // 7. Passenger count
        // --------------------------------------------------

        const passengerCount = passengerRows.length;
        if (passengerCount === 0) {

            await connection.rollback();

            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "No confirmed passengers found for this booking"
                    }
                ]
            });
        }

        // --------------------------------------------------
        // 8. Get seat inventory
        // --------------------------------------------------

        const [inventoryRows] = await connection.query(
            `
            SELECT
                id,
                total_seats,
                available_seats,
                booked_seats
            FROM seat_inventory
            WHERE train_id = ?
              AND journey_date = ?
              AND class_code = ?
              AND quota_code = ?
              AND isActive = 'Y'
            LIMIT 1
            FOR UPDATE
            `,
            [
                booking.train_id,
                booking.journey_date,
                booking.class_code,
                booking.quota_code
            ]
        );

        if (inventoryRows.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Seat inventory not found"
                    }
                ]
            });
        }

        const inventory = inventoryRows[0];
        // --------------------------------------------------
        // 9. Restore seats
        // --------------------------------------------------

        const newAvailableSeats =
            Number(inventory.available_seats) +
            passengerCount;

        const newBookedSeats =
            Number(inventory.booked_seats) -
            passengerCount;

        // --------------------------------------------------
        // 10. Validate inventory
        // --------------------------------------------------

        if (newBookedSeats < 0 || newAvailableSeats > Number(inventory.total_seats)) {
            await connection.rollback();
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption: "Invalid seat inventory"
                    }
                ]
            });
        }

        // --------------------------------------------------
        // 11. Update seat inventory
        // --------------------------------------------------

        await connection.query(
            `
            UPDATE seat_inventory
            SET
                available_seats = ?,
                booked_seats = ?
            WHERE id = ?
            `,
            [
                newAvailableSeats,
                newBookedSeats,
                inventory.id
            ]
        );

        // --------------------------------------------------
        // 12. Cancel booking
        // --------------------------------------------------

        await connection.query(
            `
            UPDATE bookings
            SET
                status = 'CANCELLED'
            WHERE id = ?
            `,
            [
                booking.id
            ]
        );

        // --------------------------------------------------
        // 13. Cancel passengers
        // --------------------------------------------------

        await connection.query(
            `
            UPDATE bookings
            SET
                status = 'CANCELLED'
            WHERE pnr = ?
              AND status = 'CONFIRMED'
            `,
            [
                pnr
            ]
        );

        // --------------------------------------------------
        // 14. Commit
        // --------------------------------------------------

        await connection.commit();

        // --------------------------------------------------
        // 15. Response
        // --------------------------------------------------

        return res.status(200).json({
            status: true,
            lookUpData: [],
            data: {
                pnr: booking.pnr,
                status: "CANCELLED",
                restoredSeats: passengerCount,
                passengers: passengerRows
            },
            message: [
                {
                    descrption: "Booking cancelled successfully"
                }
            ]
        });

    } catch (error) {

        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error(
                "Rollback error:",
                rollbackError
            );
        }

        console.error(
            "cancelBooking error:",
            error
        );

        return res.status(500).json({
            status: false,
            lookUpData: [],
            message: [
                {
                    descrption: "Failed to cancel booking"
                }
            ]
        });

    } finally {

        connection.release();

    }
};

module.exports = {
    confirmBooking, getMyBookings, cancelBooking
};