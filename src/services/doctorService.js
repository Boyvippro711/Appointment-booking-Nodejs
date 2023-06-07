import db from '../models/index';
require('dotenv').config();
import _, { reject } from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },

            })
            resolve({
                errCode: 0,
                data: doctors
            })

        } catch (e) {
            reject(e)
        }
    })
}

let saveInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action || !inputData.selectedPrice
                || !inputData.selectedPayment || !inputData.selectedProvince || !inputData.nameClinic || !inputData.addressClinic || !inputData.note) {

                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,

                    })
                } else if (inputData.action === 'EDIT') {
                    let docrMarkdwon = await db.markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (docrMarkdwon) {
                        docrMarkdwon.contentHTML = inputData.contentHTML;
                        docrMarkdwon.contentMarkdown = inputData.contentMarkdown;
                        docrMarkdwon.description = inputData.description;
                        docrMarkdwon.updateAt = new Date();
                        await docrMarkdwon.save()
                    }
                }

                let doctorinfor = await db.doctor_infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (doctorinfor) {
                    doctorinfor.priceId = inputData.selectedPrice
                    doctorinfor.provinceId = inputData.selectedProvince;
                    doctorinfor.paymentId = inputData.selectedPayment;
                    doctorinfor.note = inputData.note;
                    doctorinfor.addressClinic = inputData.addressClinic;
                    doctorinfor.nameClinic = inputData.nameClinic;
                    await doctorinfor.save()

                } else {
                    await db.doctor_infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        note: inputData.note,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Lưu thông tin thành công'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getinforDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.allcode, as: 'positionData', attributes: ['valueVi'] },
                        {
                            model: db.doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                                { model: db.allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                                { model: db.allcode, as: 'paymentTypeData', attributes: ['valueVi'] },
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                // if(data && data.image) {
                //     data.image = new Buffer(data.image, 'base64').toString('binary');      
                // }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDorId_Date = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            }
            else {
                let TimeSchedule = await db.schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        { model: db.allcode, as: 'timeTypeData', attributes: ['valueVi'] },
                        //{ model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!TimeSchedule)
                    TimeSchedule = []

                resolve({
                    errCode: 0,
                    data: TimeSchedule
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date || !data.maxNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            }
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = data.maxNumber;
                        item.currentNumber = 0;
                        return item;
                    })
                }
                let existring = await db.schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    //raw: false
                });

                let toCreate = _.differenceWith(schedule, existring, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })

                if (toCreate && toCreate.length > 0) {
                    await db.schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            }
            else {
                let doctors = await db.schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        { model: db.allcode, as: 'timeTypeData', attributes: ['valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctors)
                    doctors = []

                resolve({
                    errCode: 0,
                    data: doctors
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInforDoctor = (doctorid) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorid) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let data = await db.doctor_infor.findOne({
                    where: {
                        doctorId: doctorid
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                        { model: db.allcode, as: 'paymentTypeData', attributes: ['valueVi'] },
                        { model: db.allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.allcode, as: 'positionData', attributes: ['valueVi'] },
                        {
                            model: db.doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.allcode, as: 'priceTypeData', attributes: ['valueVi'] },
                                { model: db.allcode, as: 'provinceTypeData', attributes: ['valueVi'] },
                                { model: db.allcode, as: 'paymentTypeData', attributes: ['valueVi'] },
                            ]
                        },

                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let data = await db.booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData', attributes: ['email', 'firstName', 'address', 'gender', 'phoneNumber'],
                            include: [
                                { model: db.allcode, as: 'genderData', attributes: ['valueVi'] },
                            ],
                        },
                        { model: db.allcode, as: 'timeTypeDataPatient', attributes: ['valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.email || !data.patientId || !data.timeType
                || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }

                await emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    //data: data
                    errMessage: 'ok'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInforDoctor: saveInforDoctor,
    getinforDoctorById: getinforDoctorById,
    getScheduleByDorId_Date: getScheduleByDorId_Date,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctor: getExtraInforDoctor,
    getProfileDoctor: getProfileDoctor,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
}