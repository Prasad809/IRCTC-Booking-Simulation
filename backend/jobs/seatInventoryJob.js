const cron = require("node-cron");
const dbPool = require("../dbConnection");
const generateSeatInventory = async () => {
    console.log("==========================================");
    console.log("Seat inventory job started");
    console.log("Time:", new Date());
    console.log("==========================================");

    try {
        const [trains] = await dbPool.query(`
            SELECT id
            FROM trains
            WHERE isActive = 'Y'
        `);

        if (trains.length === 0) {
            console.log("No active trains found");
            return;
        }

        /*
         * Get active quotas
         */
        const [quotas] = await dbPool.query(`
            SELECT
                code,
                seat_share
            FROM quotas
        `);

        if (quotas.length === 0) {
            console.log("No quotas found");
            return;
        }

        let insertedCount = 0;

        /*
         * Process every active train
         */
        for (const train of trains) {

            /*
             * Get running days for this train
             */
            const [runDays] = await dbPool.query(`
                SELECT day_of_week
                FROM train_run_days
                WHERE train_id = ?
                AND is_active = 'Y'
            `, [train.id]);

            if (runDays.length === 0) {
                continue;
            }

            const runningDays = runDays.map(
                row => row.day_of_week.toLowerCase()
            );

            /*
             * Get classes for this train
             */
            const [classes] = await dbPool.query(`
                SELECT
                    class_code,
                    total_seats
                FROM train_classes
                WHERE train_id = ?
                AND isActive = 'Y'
            `, [train.id]);

            if (classes.length === 0) {
                continue;
            }

            /*
             * Generate next 30 days
             */
            for (let i = 0; i < 30; i++) {

                const journeyDate = new Date();

                journeyDate.setHours(0, 0, 0, 0);
                journeyDate.setDate(
                    journeyDate.getDate() + i + 1
                );

                /*
                 * Convert JS day number to:
                 * Sun, Mon, Tue, Wed, Thu, Fri, Sat
                 */
                const dayNames = [
                    "sun",
                    "mon",
                    "tue",
                    "wed",
                    "thu",
                    "fri",
                    "sat"
                ];

                const dayName = dayNames[
                    journeyDate.getDay()
                ];

                /*
                 * Skip if train doesn't run this day
                 */
                if (!runningDays.includes(dayName)) {
                    continue;
                }

                /*
                 * Format YYYY-MM-DD
                 */
                const year = journeyDate.getFullYear();

                const month = String(
                    journeyDate.getMonth() + 1
                ).padStart(2, "0");

                const day = String(
                    journeyDate.getDate()
                ).padStart(2, "0");

                const formattedDate =
                    `${year}-${month}-${day}`;

                /*
                 * Process every class
                 */
                for (const trainClass of classes) {

                    const totalSeats =
                        Number(trainClass.total_seats);

                    /*
                     * Process every quota
                     */
                    for (const quota of quotas) {

                        const seatShare =
                            Number(quota.seat_share);

                        let quotaSeats =
                            Math.round(
                                totalSeats * seatShare
                            );

                        /*
                         * Don't allow zero seats
                         */
                        quotaSeats = Math.max(
                            1,
                            quotaSeats
                        );

                        /*
                         * Insert inventory.
                         *
                         * UNIQUE KEY:
                         * train_id +
                         * journey_date +
                         * class_code +
                         * quota_code
                         *
                         * prevents duplicates.
                         */
                        const [result] =
                            await dbPool.query(`
                                INSERT IGNORE INTO seat_inventory
                                (
                                    train_id,
                                    journey_date,
                                    class_code,
                                    quota_code,
                                    total_seats,
                                    available_seats,
                                    booked_seats,
                                    isActive
                                )
                                VALUES (?, ?, ?, ?, ?, ?, 0, 'Y')
                            `, [
                                train.id,
                                formattedDate,
                                trainClass.class_code,
                                quota.code,
                                quotaSeats,
                                quotaSeats
                            ]);

                        if (result.affectedRows > 0) {
                            insertedCount++;
                        }
                    }
                }
            }
        }

        console.log(
            `Seat inventory job completed. Inserted: ${insertedCount}`
        );

    } catch (error) {

        console.error(
            "Seat inventory job failed:",
            error
        );
    }
};


/*
 * Run every day at 00:05 AM
 *
 * ┌──────── minute
 * │ ┌────── hour
 * │ │ ┌──── day
 * │ │ │ ┌── month
 * │ │ │ │ ┌ day of week
 * │ │ │ │ │
 * 1 13 * * *
 */
cron.schedule("1 13 * * *", async () => {
    console.log("Running scheduled seat inventory job...");
    await generateSeatInventory();
}, { timezone: "Asia/Kolkata"});


module.exports = { generateSeatInventory };