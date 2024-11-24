const verifyAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== 1) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
  