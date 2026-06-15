const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: ["admin", "auth", "users", "claims", "policies", "support", "settings", "documents"],
      default: "admin",
    },
    description: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);