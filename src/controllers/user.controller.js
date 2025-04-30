const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository")
const baseResponse = require("../utils/baseResponse.util")

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

exports.registerUser = async (req, res) => {
    const { email, password, name } = req.query;

    if (!email || !password || !name) {
        return baseResponse(res, false, 400, "Email, password, and name are required");
    }

    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, "Password must be at least 8 characters long, contain at least one number, and one special character");
    }

    try {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 400, "Email already used", null);
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await userRepository.createUser({ email, password: hashedPassword, name });
        return baseResponse(res, true, 200, "User created", newUser);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return baseResponse(res, false, 400, "Email and password are required");
    }

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        return baseResponse(res, true, 200, "Login success", user);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return baseResponse(res, false, 400, "Email is required");
    }

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.updateUser = async (req, res) => {
    const { id, email, password, name } = req.body;

    if (!id || !email || !password || !name) {
        return baseResponse(res, false, 400, "Id, email, password, and name are required");
    }

    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, "Password must be at least 8 characters long, contain at least one number, and one special character");
    }

    try {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        const hashedPassword = await hashPassword(password);
        const updatedUser = await userRepository.updateUser({ id, email, password: hashedPassword, name });

        return baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "User ID is required");
    }

    try {
        const user = await userRepository.getUserById(id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        const deletedUser = await userRepository.deleteUser(id);

        return baseResponse(res, true, 200, "User deleted", deletedUser);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.topUpUser = async (req, res) => {
    const { id, amount } = req.query;

    if (!id || !amount) {
        return baseResponse(res, false, 400, "User ID and amount are required");
    }

    const topUpAmount = parseInt(amount, 10);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
        return baseResponse(res, false, 400, "Amount must be larger than 0");
    }

    try {
        const user = await userRepository.getUserById(id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        const updatedBalance = user.balance + topUpAmount;
        const updatedUser = await userRepository.updateUserBalance(id, updatedBalance);

        return baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};