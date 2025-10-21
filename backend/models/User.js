const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please add a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [128, "Password cannot be more than 128 characters"],
      select: false,
      validate: {
        validator: function (password) {
          // Require at least one number and one letter
          return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
        },
      message: "Password must contain at least one letter and one number",
      select: false, 
      },
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      enum: {
        values: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR", "CNY"],
        message: "Currency {VALUE} is not supported",
      },
    },
    monthlyBudget: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
