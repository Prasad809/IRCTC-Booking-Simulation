# IRCTC Booking Simulation

A simulated train-ticket booking system built with React + custom Redux
(plain `redux` + `redux-thunk`, `react-redux`). There is **no backend and no
REST/axios calls anywhere** — all "server" behavior (user database, train
routes, seat availability, payment gateway, bookings) is simulated inside
Redux action creators and persisted to `localStorage` so state survives a
page refresh.

## Features

**User**
- Signup / Login (session kept in `authReducer`, user "table" in `usersReducer`)
- Profile view/edit
- Save debit/credit/UPI payment methods (masked card numbers)
- Passenger Master list (save passengers for reuse across bookings)
- Search trains by source, destination, date
- Check availability by class (SL/3A/2A/1A/CC) and quota (General/Tatkal/Ladies/Sr. Citizen)
- Add passenger details (name, age, gender, berth preference) per booking
- Mock/simulated payment gateway (~8% random decline + a "force fail" test card ending in 0000)
- Booking confirmation (PNR + e-ticket view) and cancellation

**Admin**
- Separate admin role (seeded account: `admin` / `Admin@123`)
- Add new train routes (train no/name, source/destination, timing, running days, class fares & seat counts)
- Dashboard of all routes and all bookings across users

## Architecture

```
src/
  MainStore/        Store.js, Reducers.js, persist.js (localStorage sync)
  Common/           Header, Footer, route guards, seed data, shared utils
  Pages/
    Auth/           Login.js, SignUp.js, Store/{Action,Reducer}.js
    Profile/        UserProfile.js, Store/{Action}.js
    PaymentMethods/ PaymentMethods.js, Store/{Action,Reducer}.js
    Passengers/     PassengerMaster.js, Store/{Action,Reducer}.js
    Trains/         SearchTrains.js, TrainResults.js, Store/{Action,Reducer,availability}.js
    Booking/        BookPassengers.js, PaymentGateway.js, BookingConfirmation.js,
                    MyBookings.js, Store/{Action,Reducer}.js
    Admin/          AdminAddRoute.js, AdminDashboard.js
    Dashboard/      Dashboard.js
```

Every feature follows the same `Store/Action.js` + `Store/Reducer.js` pattern,
combined in `MainStore/Reducers.js`. Async-looking behavior (login, payment
processing, etc.) uses `redux-thunk` purely to simulate network latency with
`setTimeout` — nothing ever leaves the browser.

## Running locally

```bash
npm install
npm start       # http://localhost:3000
```

Login as a normal user via Sign Up, or use the seeded admin account:
- Username: `admin`
- Password: `Admin@123`
