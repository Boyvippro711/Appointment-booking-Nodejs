import { reject, result } from "lodash";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { raw } from "express";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let DeleteSchedule = (scheduleId) => {
    return new Promise(async (resolve, reject) => {
        let isschedule = await db.schedule.findOne({
            where: {
                id: scheduleId,
            },
            raw: false
        })

        if (!isschedule) {
            resolve({
                errCode: 2,
                errMessage: `Không tồn tại thời gian khám`
            })
        }
        await isschedule.destroy();

        // isschedule = await db.schedule.destroy({
        //     where: {
        //         id: id
        //     },
        //     raw: false
        // })

        resolve({
            errCode: 0,
            errMessage: `Xóa tài khoản thành công`
        })
    })
}


let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName
                || !data.selectGender || !data.address || !data.currentNumber || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                await emailService.sendTestEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    redireactLink: buildUrlEmail(data.doctorId, token)
                })

                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phoneNumber,
                    },
                })
                //console.log('asdas', user[0])
                if (user && user[0]) {
                    await db.booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                        },
                    })
                }

                let currentNumber = +data.currentNumber + 1;
                let maxNumber = +data.maxNumber;
                if (currentNumber < maxNumber) {
                    let res = await db.schedule.findOne({
                        where: {
                            id: data.id,
                            date: data.date,
                            timeType: data.timeType
                        },
                        raw: false
                    })
                    res.currentNumber = currentNumber;
                    console.log('check ++:', res.currentNumber)
                    String(res.currentNumber)
                    await res.save()
                    console.log('check data.currentNumber++ service:', res)
                } else {
                    await DeleteSchedule(data.id)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Lưu lịch hẹn thành công',
                    //data: 
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}


let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin'
                })
            } else {
                let appointment = await db.booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Xác nhận lịch khám thành công '
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Lịch hẹn đã xác nhận hoặc không tồn tại'
                    })
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
}