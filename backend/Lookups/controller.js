const dbPool = require("../dbConnection");







const paymentTypes=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT payment_type_id AS id,payment_type AS value FROM payment_types ORDER BY payment_type_id`);
        return res.json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] }).status(500)
    } catch (error) {
        console.log(error);
        
        return res.json({ status: false, message: [{ descrption: "internal Server Error" }] }).status(500)
    }
}

const cancelStatus=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT cancel_id AS id,cancel_name AS value FROM cancellation_status ORDER BY cancel_id`);
        return res.json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] }).status(500)
    } catch (error) {
        console.log(error);
        
        return res.json({ status: false, message: [{ descrption: "internal Server Error" }] }).status(500)
    }
}
const paymentStatus=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT payment_id AS id,payment_name AS value FROM payment_status ORDER BY payment_id`);
        return res.json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] }).status(500)
    } catch (error) {
        console.log(error);
        
        return res.json({ status: false, message: [{ descrption: "internal Server Error" }] }).status(500)
    }
}
const passengerStatus=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT passenger_id AS id,passenger_name AS value FROM passenger_status ORDER BY passenger_id`);
        return res.json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] }).status(500)
    } catch (error) {
        console.log(error);
        
        return res.json({ status: false, message: [{ descrption: "internal Server Error" }] }).status(500)
    }
}



//used lookups
const trainClasses=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT id AS id,class_code AS code,class_label as label FROM train_class_info ORDER BY id`);
        return res.status(200).json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] });
    }
}

const quotas=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT id,quota_code AS code,quota_label as label,quota_share as share FROM train_quota_info ORDER BY id`);
        return res.status(200).json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] });
    }
}

const trainBerths=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT berth_id AS id,berth_name AS value FROM berths ORDER BY berth_id`);
        return res.status(200).json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

const weekDaysList=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT id AS id,day AS value FROM weekdays ORDER BY id`);
        return res.status(200).json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

const genders=async(req,res)=>{
    try {
        const [rows] = await dbPool.query(`SELECT gender_id AS id,code AS  \`key\`,gender AS value FROM genders ORDER BY gender_id`);
        return res.status(200).json({ status: true,lookUpData:rows, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

const updateUserDetails = async (req, res) => {
    const { userNameOrEmail, email, userName, mobile } = req.body;
    try {
        const [users] = await dbPool.query(
            `SELECT *
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );
        if (users.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        await dbPool.query(`UPDATE users set email = ?,user_name = ?,mobile = ? WHERE user_name = ? OR email = ?`, [email,userName, mobile, userNameOrEmail, userNameOrEmail]);
        return res.status(200).json({ status: true, message: [{ description: "User Updated Succesfully..!" }] });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: true, message: [{ description: "Internal Server Error" }] });
    }
};

const getUserDetails = async (req, res) => {
    const { userNameOrEmail } = req.body;
    try {
        const [users] = await dbPool.query(
            `SELECT 
                user_name as userName,
                email,
                mobile,
                role
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );
        if (users.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        return res.status(200).json({ status: true,user:users[0], message: [{ description: "Request processed successfully" }] });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: true, message: [{ description: "Internal Server Error" }] });
    }
};

const menusAuth = async (req, res) => {
    const { userNameOrEmail,role } = req.body;
    try {
        const [users] = await dbPool.query(
            `SELECT 
                role
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );
        if (users.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        if(role.toUpperCase() === "ADMIN"){
            const adminPathsIds = [{id: 3,path: "/addTrainRoute",name:"Add Route"}, {id: 5,path: "/adminDashboard",name:"Admin Dashboard"}];
            return res.status(200).json({ status: true, paths: adminPathsIds, message: [{ description: "Request processed successfully" }] });
        }else{
            const userPathsIds = [
                { id: 13, path: "/searchTrains", name: "Search Trains", title: "Search Trains", desc: "Find trains by source, destination and date", icon: "🚆" },
                { id: 8, path: "/myBookings", name: "My Bookings", title: "My Bookings", desc: "View, download or cancel your tickets", icon: "🎫" },
                { id: 10, path: "/passengerMaster", name: "Passenger Master", title: "Passenger Master", desc: "Manage your passenger master list", icon: "🧑‍🤝‍🧑" },
                { id: 11, path: "/paymentMethods", name: "Payment Methods", title: "Payment Methods", desc: "Manage saved cards and UPI IDs", icon: "💳" },
                { id: 12, path: "/userProfile", name: "User Profile", title: "User Profile", desc: "View and update your profile information", icon: "👤" },
            ];
            return res.status(200).json({ status: true, paths: userPathsIds, message: [{ description: "Request processed successfully" }] });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: true, message: [{ description: "Internal Server Error" }] });
    }
};

module.exports = { trainClasses,trainBerths,genders,paymentTypes,cancelStatus,paymentStatus,passengerStatus,quotas,getUserDetails,updateUserDetails,menusAuth,weekDaysList };  
