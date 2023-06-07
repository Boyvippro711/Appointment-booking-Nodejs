
import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';



const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber
               
            })
            console.log(data)
            resolve('ok create a new');
        }catch(e){
            reject(e);
        }
    })
   
    // console.log('dada from dsd')

    // console.log(data)
    // console.log(hashPasswordFromBcrypt)
}

let hashUserPassword = (password) =>{
    return new Promise(async(resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch(e){
            reject(e);
        }
        
    })
}

let getAllUser = () => {
    return new Promise(async(resolve, reject) =>{
        try{
            let users = await db.User.findAll({
                raw : true,
            });
            resolve(users)
        }catch(e){
            reject(e)
        }
    })
}  

let getUserInfoById = (userId) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let user = await db.User.findOne({
                where: { id : userId},
                raw : true,
            })

            //resolve(user)

            if(user){
                resolve(user)
            }
            else{
                resolve({})
            }

        }catch(e){
            reject(e);
        }
    })
}
let updateUserData = (data) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let user = await db.User.findOne({
                where: {id: data.id},
                raw : false
            })

            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                resolve();
    
            }
            else{
                resolve();
            }
            // let allUsers = await db.user.findAll();
            // resolve(allUsers);        
         
        }catch(e){
            console.log(e);
        }
    })
}

let deleteUserById = (userId) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let user = await db.User.findOne({
                where : {id : userId},
                raw : false
            })

            if(user){
                await user.destroy();
            }
            resolve();

        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}