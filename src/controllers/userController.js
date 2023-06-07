
import userService from "../services/userService";

let handleLogin = async (req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: 'Thieu thon tin!'
        })
    }

    let userData = await userService.handleUserLogin(email,password);
        return res.status(200).json({
            errCode : userData.errCode,
            message : userData.errMessage,
            user : userData.user ? userData.user : {}
        })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;
    console.log(id)
    if(!id){
        return res.status(200).json({
            errCode : 1,
            errMessage: "Đối tượng không tồn tại",
            users: []
        }); 
    }

    let users = await userService.getAllUsers(id);
    console.log(users)

    return res.status(200).json({
        errCode : 0,
        errMessage: "OK",
        users
    })
}

let hanldCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json ({
            errCode: 1,
            errMessage: 'Đối tượng không tồn tại'
        });
    }
    let message = await userService.DeleteUser(req.body.id);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message =  await userService.EditUser(data);
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try{
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    }catch(e){
        console.log(' get allcode eror: ',e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ Server'
        });
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers : handleGetAllUsers,
    hanldCreateNewUser : hanldCreateNewUser,
    handleEditUser : handleEditUser,
    handleDeleteUser : handleDeleteUser,
    getAllCode : getAllCode,
}