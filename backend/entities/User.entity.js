import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    email: {
      type: "varchar",
      unique: true,
    },

    password: {
      type: "varchar",
    },

    name: {
      type: "varchar",
    },

    isVerified: {
      type: "boolean",
      default: false,
    },

    lastLogin: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },

    resetPasswordToken: {
      type: "varchar",
      nullable: true,
    },

    resetPasswordExpiresAt: {
      type: "timestamp",
      nullable: true,
    },

    verificationToken: {
      type: "varchar",
      nullable: true,
    },

    verificationTokenExpiresAt: {
      type: "timestamp",
      nullable: true,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});