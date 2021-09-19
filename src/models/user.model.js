const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "A user must have a first name"],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, "A user must have a last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minLength: [8, "A user password must be at least 8 characters"],
      trim: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    profile: String,
    passwordChangedAt: {
      type: Date,
    },
    age: {
      type: Number,
    },
    country: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin"],
        message: "User role must be user or admin only",
      },
      lowercase: true,
      trim: true,
    },
    createdAt: {
      type: String,
      default: new Date(),
    },
    modifiedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
});

// doc middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});
userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});
// doc methods
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.passwordChangedAfterToken = function (tokenIat) {
  if (this.passwordChangedAt) {
    const ConvertedTokenIat = +tokenIat * 1000;
    return +this.passwordChangedAt > ConvertedTokenIat;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
