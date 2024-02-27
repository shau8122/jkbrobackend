const sendToken = async (user, statusCode, res) => {
    try {
        const token = await user.generateAuthToken();
        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true, // Set Secure flag for HTTPS
            sameSite: 'None' // Set SameSite=None for cross-site requests
        };
        // Send token as a cookie and user data in the response body
        res.status(statusCode).cookie('token', token, options).json({
            success: true,
            token,
            user
        });

        console.log("Token sent successfully");
    } catch (error) {
        console.error('Error generating token:', error);

        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = sendToken;
