/**
 * Must run AFTER authMiddleware (which verifies the JWT and sets
 * req.user = { userId, role, iat, exp }). This only checks the role
 * that's already on req.user — it doesn't touch tokens itself.
 */
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin role required.",
        });
    }

    next();
};

module.exports = adminMiddleware;
