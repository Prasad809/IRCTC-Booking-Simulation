const dbPool = require("../dbConnection");

const convertDurationToMinutes = (duration) => {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);
    const h = hours ? Number(hours[1]) : 0;
    const m = minutes ? Number(minutes[1]) : 0;
    return h * 60 + m;
};

const createTrainRoutes = async (req, res) => {
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            userNameOrEmail,
            trainNo,
            trainName,
            source,
            destination,
            departureTime,
            arrivalTime,
            duration,
            runDays,
            classes
        } = req.body;

        // Validate train details
        if (
            !userNameOrEmail ||
            !trainNo ||
            !trainName ||
            !source ||
            !destination ||
            !departureTime ||
            !arrivalTime ||
            !duration
        ) {
            return res.status(400).json({
                status: false,
                message: [
                    {
                        description: "All train details are required"
                    }
                ]
            });
        }

        // Find user
        const [rows] = await connection.query(
            `SELECT *
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: [
                    {
                        description: "User not found"
                    }
                ]
            });
        }

        const user = rows[0];

        // Source and destination validation
        if (source === destination) {
            return res.status(400).json({
                status: false,
                message: [
                    {
                        description:
                            "Source and destination cannot be the same"
                    }
                ]
            });
        }

        // Run days validation
        if (!runDays || runDays.length === 0) {
            return res.status(400).json({
                status: false,
                message: [
                    {
                        description:
                            "At least one running day is required"
                    }
                ]
            });
        }

        // Classes validation
        if (!classes || classes.length === 0) {
            return res.status(400).json({
                status: false,
                message: [
                    {
                        description:
                            "At least one train class is required"
                    }
                ]
            });
        }

        // Convert duration
        const durationMinutes =
            convertDurationToMinutes(duration);

        // Train number
        const [trains] = await connection.query(
            `SELECT *
             FROM trains
             WHERE train_no = ?`,
            [trainNo]
        );

        if (!trainNo || trains.length > 0) {
            return res.status(400).json({
                status: false,
                message: [
                    {
                        description:
                            "Train Already Create with this Train Number"
                    }
                ]
            });
        }

        // Create train
        const [trainResult] = await connection.execute(
            `
            INSERT INTO trains
            (
                user_id,
                train_no,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time,
                duration_minutes,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user.id,
                trainNo,
                trainName,
                source,
                destination,
                departureTime,
                arrivalTime,
                durationMinutes,
                user.id
            ]
        );

        const trainId = trainResult.insertId;

        // Insert running days
        for (const day of runDays) {

            await connection.execute(
                `
                INSERT INTO train_run_days
                (
                    train_id,
                    day_of_week,
                    is_active
                )
                VALUES (?, ?, ?)
                `,
                [
                    trainId,
                    day,
                    "Y"
                ]
            );
        }

        // Insert classes
        for (const item of classes) {

            await connection.execute(
                `
                INSERT INTO train_classes
                (
                    user_id,
                    train_id,
                    class_code,
                    fare,
                    total_seats
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    user.id,
                    trainId,
                    item.code,
                    Number(item.fare),
                    Number(item.totalSeats)
                ]
            );
        }

        await connection.commit();

        return res.status(201).json({
            status: true,
            trainDtls: {
                trainId,
                trainNo,
                trainName
            },
            message: [
                {
                    description: "Train Created Successfully"
                }
            ]
        });

    } catch (error) {

        console.error("createTrain Error:", error);

        await connection.rollback();

        return res.status(500).json({
            status: false,
            message: [
                {
                    description: "Internal Server Error"
                }
            ]
        });

    } finally {
        connection.release();
    }
};

const getTrainRoutes = async (req, res) => {

    const { userNameOrEmail } = req.body;

    try {

        const [rows] = await dbPool.query(
            `SELECT *
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: [
                    {
                        description: "User not found"
                    }
                ]
            });
        }

        const user = rows[0];

        const [trains] = await dbPool.query(`
            SELECT
                t.id,
                t.train_no AS trainNo,
                t.train_name AS trainName,
                t.source AS source,
                t.destination AS destination,

                TIME_FORMAT(
                    t.departure_time,
                    '%H:%i'
                ) AS departureTime,

                TIME_FORMAT(
                    t.arrival_time,
                    '%H:%i'
                ) AS arrivalTime,

                CONCAT(
                    FLOOR(t.duration_minutes / 60),
                    'h ',
                    MOD(t.duration_minutes, 60),
                    'm'
                ) AS duration,

                (
                    SELECT JSON_ARRAYAGG(
                        tr.day_of_week
                    )
                    FROM train_run_days tr
                    WHERE tr.train_id = t.id
                    AND tr.is_active = 'Y'
                ) AS runDays,

                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'code',
                            tc.class_code,
                            'fare',
                            tc.fare,
                            'totalSeats',
                            tc.total_seats
                        )
                    )
                    FROM train_classes tc
                    WHERE tc.train_id = t.id
                ) AS classes

            FROM trains t

            WHERE t.user_id = ?
            AND t.isActive = ?

        `, [
            user.id,
            "Y"
        ]);

        return res.status(200).json({
            status: true,
            lookUpData: trains,
            message: [
                {
                    description:
                        "Request processed successfully"
                }
            ]
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: [
                {
                    description: "Internal Server Error"
                }
            ]
        });
    }
};

const getTrainsList = async (req, res) => {

    try {

        const [trains] = await dbPool.query(`
            SELECT value AS \`key\`, value
            FROM (
                SELECT source AS value
                FROM trains
                WHERE isActive = 'Y'
                AND source IS NOT NULL
                AND source <> ''

                UNION

                SELECT destination AS value
                FROM trains
                WHERE isActive = 'Y'
                AND destination IS NOT NULL
                AND destination <> ''
            ) AS locations
            ORDER BY value
        `);

        return res.status(200).json({
            status: true,
            lookUpData: trains,
            message: [
                {
                    description: "Request processed successfully"
                }
            ]
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: [
                {
                    description: "Internal Server Error"
                }
            ]
        });
    }
};

const removeTrainRoutes = async (req, res) => {
    const { userNameOrEmail, trainId } = req.body;
    try {
        const [rows] = await dbPool.query(
            `SELECT *
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: [
                    {
                        description: "User not found"
                    }
                ]
            });
        }
        const user = rows[0];
        const [train] = await dbPool.query(`SELECT * FROM trains WHERE id = ? AND user_id = ?`, [trainId, user.id]);

        if (train.length === 0) {
            return res.status(404).json({
                status: false,
                message: [
                    {
                        description: "Train not found"
                    }
                ]
            });
        }

        const update = await dbPool.query(`
            UPDATE trains set isActive = ? WHERE id = ? AND user_id = ?
            `, ["N", trainId, user.id]);


        return res.status(200).json({
            status: true,
            message: [
                {
                    description: "Request processed successfully"
                }
            ]
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: [
                {
                    description: "Internal Server Error"
                }
            ]
        });
    }
};

const searchTrains = async (req, res) => {
    try {

        const {
            source,
            destination,
            journeyDate
        } = req.body;

        // Validate required fields
        if (!source || !destination || !journeyDate) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "Source, destination and journey date are required"
                    }
                ]
            });
        }

        // Validate source and destination
        if (
            source.trim().toLowerCase() ===
            destination.trim().toLowerCase()
        ) {
            return res.status(400).json({
                status: false,
                lookUpData: [],
                message: [
                    {
                        descrption:
                            "Source and destination cannot be same"
                    }
                ]
            });
        }

        const [rows] = await dbPool.query(
            `
            SELECT

                t.id AS train_id,

                t.train_no AS trainNo,

                t.train_name AS trainName,

                t.source,

                t.destination,

                TIME_FORMAT(
                    t.departure_time,
                    '%H:%i'
                ) AS departureTime,

                TIME_FORMAT(
                    t.arrival_time,
                    '%H:%i'
                ) AS arrivalTime,

                t.duration_minutes AS durationMinutes,

                tc.class_code AS classCode,

                tc.fare,

                tc.total_seats AS totalSeats,

                q.code AS quota,

                COALESCE(
                    si.available_seats,
                    0
                ) AS availableSeats

            FROM trains t

            INNER JOIN train_run_days trd
                ON trd.train_id = t.id

                AND trd.is_active = 'Y'

                AND trd.day_of_week =
                    CASE DAYOFWEEK(?)
                        WHEN 1 THEN 'Sun'
                        WHEN 2 THEN 'Mon'
                        WHEN 3 THEN 'Tue'
                        WHEN 4 THEN 'Wed'
                        WHEN 5 THEN 'Thu'
                        WHEN 6 THEN 'Fri'
                        WHEN 7 THEN 'Sat'
                    END

            INNER JOIN train_classes tc
                ON tc.train_id = t.id

                AND tc.isActive = 'Y'

            CROSS JOIN quotas q

            LEFT JOIN seat_inventory si
                ON si.train_id = t.id

                AND si.class_code = tc.class_code

                AND si.quota_code = q.code

                AND si.journey_date = ?

                AND si.isActive = 'Y'

            WHERE
                t.isActive = 'Y'

                AND LOWER(TRIM(t.source))
                    = LOWER(TRIM(?))

                AND LOWER(TRIM(t.destination))
                    = LOWER(TRIM(?))

            ORDER BY
                t.departure_time,
                tc.class_code,
                q.code
            `,
            [
                journeyDate,
                journeyDate,
                source,
                destination
            ]
        );

        // Group trains
        const trainMap = {};

        rows.forEach((row) => {

            // Create train
            if (!trainMap[row.train_id]) {

                trainMap[row.train_id] = {

                    id: row.train_id,

                    trainNo: row.trainNo,

                    trainName: row.trainName,

                    source: row.source,

                    destination: row.destination,

                    departureTime: row.departureTime,

                    arrivalTime: row.arrivalTime,

                    duration:
                        `${Math.floor(row.durationMinutes / 60)}h ` +
                        `${row.durationMinutes % 60}m`,

                    classes: []
                };
            }

            const train = trainMap[row.train_id];

            // Find class
            let classData = train.classes.find(
                (item) =>
                    item.code === row.classCode
            );

            // Create class only once
            if (!classData) {

                classData = {

                    code: row.classCode,

                    fare: Number(row.fare),

                    totalSeats:
                        Number(row.totalSeats),

                    quotas: []
                };

                train.classes.push(classData);
            }

            // Add quota
            classData.quotas.push({

                quota: row.quota,

                availableSeats:
                    Number(row.availableSeats)

            });
        });

        const trains = Object.values(trainMap);

        return res.status(200).json({

            status: true,

            lookUpData: trains,

            message: [
                {
                    descrption:
                        "Request processed successfully"
                }
            ]
        });

    } catch (error) {

        console.error(
            "searchTrains error:",
            error
        );

        return res.status(500).json({

            status: false,

            lookUpData: [],

            message: [
                {
                    descrption:
                        "Internal server error"
                }
            ]
        });
    }
};



module.exports = { createTrainRoutes, getTrainRoutes, removeTrainRoutes, getTrainsList,searchTrains }