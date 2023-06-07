import express from "express";
//import homecontroller from "../controllers/homeController"
import homecontroller from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";

let router = express.Router();

let initWebRoutes = (app) => {

    router.get('/', homecontroller.getHomePage);
    //router.get('/CRUD',homecontroller.getRE);
    router.get('/crud', homecontroller.getCURD);

    router.post('/post-crud', homecontroller.postCRUD);
    router.get('/get-crud', homecontroller.displayCRUD);
    router.get('/edit-crud', homecontroller.getEditCRUD);
    router.post('/put-crud', homecontroller.putCRUD);
    router.get('/delete-crud', homecontroller.deleteCRUD);


    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.hanldCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctors', doctorController.saveInforDoctor);

    router.get('/api/get-infor-doctor-by-id', doctorController.getinforDoctorById);
    router.get('/api/get-schedules-by-docrId-date', doctorController.getScheduleByDorId_Date);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedules-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctor);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctor);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);




    return app.use("/", router);
}

module.exports = initWebRoutes;
