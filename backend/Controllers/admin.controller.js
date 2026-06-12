const User = require("../Models/userModel.model");
const Policy = require("../Models/policy.model");
const Claim = require("../Models/claim.model");
const Payment = require("../Models/payment.model");
const KycRequest = require("../Models/kycRequest.model");
const SystemSetting = require("../Models/systemSetting.model");
const AuditLog = require("../Models/auditlog.model");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

const getDashboard = catchAsync(async (req, res) => {
  const [totalUsers, totalAgents, activePolicies, pendingClaims, revenueAgg, pendingKyc] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "agent" }),
    Policy.countDocuments({ status: "active" }),
    Claim.countDocuments({ status: "pending" }),
    Payment.aggregate([{ $match: { status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    KycRequest.countDocuments({ status: "pending" }),
  ]);

  const recentUsers = await User.find().select("full_name email role created_at kyc_status").sort({ created_at: -1 }).limit(8);
  const recentClaims = await Claim.find().populate("user", "full_name email").sort({ createdAt: -1 }).limit(8);

  res.status(200).json({
    success: true,
    data: {
      widgets: {
        totalUsers,
        totalAgents,
        activePolicies,
        pendingClaims,
        totalRevenue: revenueAgg?.[0]?.total || 0,
        pendingKycRequests: pendingKyc,
      },
      recentUsers,
      recentClaims,
    },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ created_at: -1 });
  res.status(200).json({ success: true, data: users });
});

const getAgents = catchAsync(async (req, res) => {
  const agents = await User.find({ role: "agent" }).select("-password").sort({ created_at: -1 });
  res.status(200).json({ success: true, data: agents });
});

const getPolicies = catchAsync(async (req, res) => {
  const policies = await Policy.find().populate("user", "full_name email phone role").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: policies });
});

const getClaims = catchAsync(async (req, res) => {
  const claims = await Claim.find().populate("user", "full_name email phone role").populate("policy").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: claims });
});

const getPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find().populate("user", "full_name email phone role").populate("policy").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: payments });
});

const getKycRequests = catchAsync(async (req, res) => {
  const requests = await KycRequest.find().populate("user", "full_name email phone role kyc_status").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: requests });
});

const getSystemSettings = catchAsync(async (req, res) => {
  let settings = await SystemSetting.findOne().sort({ createdAt: -1 });

  if (!settings) {
    settings = await SystemSetting.create({});
  }

  res.status(200).json({ success: true, data: settings });
});

const updateSystemSettings = catchAsync(async (req, res) => {
  const settings = await SystemSetting.findOneAndUpdate(
    {},
    { $set: req.body },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  res.status(200).json({ success: true, message: "Admin settings updated", data: settings });
});

const createAuditLog = catchAsync(async (req, res, next) => {
  const { action, module = "admin", description = "" } = req.body;

  if (!action || !String(action).trim()) {
    return next(new AppError("Action is required", 400));
  }

  const log = await AuditLog.create({
    admin: req.user._id,
    action: String(action).trim(),
    module: String(module || "admin").trim(),
    description: String(description || action).trim(),
    ipAddress: req.ip || "",
  });

  const populatedLog = await AuditLog.findById(log._id).populate("admin", "fullName email role");

  res.status(201).json({ success: true, message: "Audit log saved", data: populatedLog });
});

const getAuditLogs = catchAsync(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("admin", "fullName email role")
    .sort({ createdAt: -1 })
    .limit(100);

  res.status(200).json({ success: true, data: logs });
});

const reviewKyc = catchAsync(async (req, res, next) => {
  const { status, review_note } = req.body;
  if (!["verified", "rejected", "pending"].includes(status)) {
    return next(new AppError("Invalid status", 400));
  }

  const requestDoc = await KycRequest.findById(req.params.id);
  if (!requestDoc) {
    return next(new AppError("KYC request not found", 404));
  }

  requestDoc.status = status;
  requestDoc.review_note = review_note || "";
  requestDoc.reviewed_by = req.user._id;
  await requestDoc.save();

  await User.findByIdAndUpdate(requestDoc.user, {
    kyc_status: status,
    is_verified: status === "verified",
  });

  res.status(200).json({
    success: true,
    message: "KYC request updated",
    data: requestDoc,
  });
});

module.exports = {
  getDashboard,
  getUsers,
  getAgents,
  getPolicies,
  getClaims,
  getPayments,
  getKycRequests,
  getSystemSettings,
  updateSystemSettings,
  createAuditLog,
  getAuditLogs,
  reviewKyc,
};
