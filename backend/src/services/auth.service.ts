import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";

const prisma = new PrismaClient();

export const authService = {
  async signup(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    collegeId: string;
  }) {
    const { name, username, email, password, collegeId } = data;

    // Check if username exists (case insensitive)
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new Error("Email already registered");
    }

    // Verify college exists and is approved
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college || !college.isApproved) {
      throw new Error("College not found or not approved");
    }

    // Verify email domain matches college
    const emailDomain = email.split("@")[1];
    if (emailDomain !== college.emailDomain) {
      throw new Error("Email domain does not match college");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        email,
        password: hashedPassword,
        collegeId,
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
        isOnboarded: Boolean(user.isOnboarded),
        college: user.college,
      },
    };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    // Map backend gender preference to frontend
    const genderPreferenceMap: { [key: string]: string } = {
      all: "everyone",
      male: "male",
      female: "female",
    };

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        //@ts-ignore
        gender: user.gender,
        interests: user.interests,
        photos: user.photos,
        isAdmin: Boolean(user.isAdmin),
        isOnboarded: Boolean(user.isOnboarded),
        college: user.college,
        preferences: user.isOnboarded
          ? {
              lookingFor: "friendship",
              ageRange: {
                min: user.preferredAgeMin || 18,
                max: user.preferredAgeMax || 30,
              },
              distance: user.preferredDistance || 50,
              genderPreference:
                genderPreferenceMap[user.preferredGender || "all"] ||
                "everyone",
            }
          : null,
      },
    };
  },

  async updateProfileSetup(
    userId: string,
    data: {
      bio: string;
      gender: string;
      interests: string[];
      photos: string[];
    }
  ) {
    const { bio, gender, interests, photos } = data;

    if (!bio || bio.trim().length === 0) {
      throw new Error("Bio is required");
    }

    if (
      !gender ||
      !["male", "female", "transgender"].includes(gender.toLowerCase())
    ) {
      throw new Error(
        "Valid gender is required (male, female, or transgender)"
      );
    }

    if (!interests || interests.length === 0) {
      throw new Error("At least one interest is required");
    }

    if (!photos || photos.length === 0) {
      throw new Error("At least one photo is required");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio.trim(),
        //@ts-ignore
        gender: gender.toLowerCase(),
        interests,
        photos,
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        //@ts-ignore
        gender: user.gender,
        interests: user.interests,
        photos: user.photos,
        isAdmin: Boolean(user.isAdmin),
        isOnboarded: Boolean(user.isOnboarded),
        //@ts-ignore
        college: user.college,
      },
    };
  },

  async updatePreferences(
    userId: string,
    data: {
      preferredAgeMin: number;
      preferredAgeMax: number;
      preferredDistance: number;
      preferredGender: string;
    }
  ) {
    const {
      preferredAgeMin,
      preferredAgeMax,
      preferredDistance,
      preferredGender,
    } = data;

    if (preferredAgeMin > preferredAgeMax) {
      throw new Error("Minimum age cannot be greater than maximum age");
    }

    if (preferredAgeMin < 18 || preferredAgeMax > 100) {
      throw new Error("Age must be between 18 and 100");
    }

    if (!["male", "female", "all"].includes(preferredGender)) {
      throw new Error("Invalid gender preference");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferredAgeMin,
        preferredAgeMax,
        preferredDistance,
        preferredGender,
        isOnboarded: true,
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Map backend gender preference to frontend
    const genderPreferenceMap: { [key: string]: string } = {
      all: "everyone",
      male: "male",
      female: "female",
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        //@ts-ignore
        gender: user.gender,
        interests: user.interests,
        photos: user.photos,
        isAdmin: Boolean(user.isAdmin),
        isOnboarded: Boolean(user.isOnboarded),
        college: user.college,
        preferences: {
          lookingFor: "friendship",
          ageRange: {
            min: user.preferredAgeMin,
            max: user.preferredAgeMax,
          },
          distance: user.preferredDistance,
          genderPreference:
            genderPreferenceMap[user.preferredGender] || "everyone",
        },
      },
    };
  },

  async updateProfile(
    userId: string,
    data: {
      name: string;
      username: string;
      bio: string;
      gender: string;
      interests: string[];
      photos: string[];
      preferences: {
        lookingFor: string;
        ageRange: { min: number; max: number };
        distance: number;
        genderPreference: string;
      };
    }
  ) {
    const { name, username, bio, gender, interests, photos, preferences } =
      data;

    // Validate inputs
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required");
    }

    if (!username || username.trim().length === 0) {
      throw new Error("Username is required");
    }

    if (
      !gender ||
      !["male", "female", "transgender"].includes(gender.toLowerCase())
    ) {
      throw new Error(
        "Valid gender is required (male, female, or transgender)"
      );
    }

    // Check if username is taken by another user
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.toLowerCase(),
          mode: "insensitive",
        },
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    if (!bio || bio.trim().length === 0) {
      throw new Error("Bio is required");
    }

    if (!interests || interests.length === 0) {
      throw new Error("At least one interest is required");
    }

    if (!photos || photos.length === 0) {
      throw new Error("At least one photo is required");
    }

    if (preferences.ageRange.min > preferences.ageRange.max) {
      throw new Error("Minimum age cannot be greater than maximum age");
    }

    if (preferences.ageRange.min < 18 || preferences.ageRange.max > 100) {
      throw new Error("Age must be between 18 and 100");
    }

    // Map frontend preferences to backend schema
    const genderMap: { [key: string]: string } = {
      everyone: "all",
      male: "male",
      female: "female",
      "non-binary": "all",
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        username: username.toLowerCase().trim(),
        bio: bio.trim(),
        //@ts-ignore
        gender: gender.toLowerCase(),
        interests,
        photos,
        preferredAgeMin: preferences.ageRange.min,
        preferredAgeMax: preferences.ageRange.max,
        preferredDistance: preferences.distance,
        preferredGender: genderMap[preferences.genderPreference] || "all",
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        //@ts-ignore
        gender: user.gender,
        interests: user.interests,
        photos: user.photos,
        isAdmin: Boolean(user.isAdmin),
        isOnboarded: Boolean(user.isOnboarded),
        //@ts-ignore
        college: user.college,
        preferences: {
          lookingFor: preferences.lookingFor,
          ageRange: {
            min: user.preferredAgeMin,
            max: user.preferredAgeMax,
          },
          distance: user.preferredDistance,
          genderPreference: preferences.genderPreference,
        },
      },
    };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("=== RAW USER FROM DATABASE ===");
    console.log("User ID:", user.id);
    console.log("Bio:", user.bio);
    console.log("Interests:", user.interests);
    console.log("Photos:", user.photos);
    console.log("PreferredAgeMin:", user.preferredAgeMin);
    console.log("PreferredAgeMax:", user.preferredAgeMax);
    console.log("PreferredDistance:", user.preferredDistance);
    console.log("PreferredGender:", user.preferredGender);
    console.log("IsOnboarded:", user.isOnboarded);
    console.log("==============================");

    const genderPreferenceMap: { [key: string]: string } = {
      all: "everyone",
      male: "male",
      female: "female",
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        //@ts-ignore
        gender: user.gender,
        interests: user.interests,
        photos: user.photos,
        isAdmin: Boolean(user.isAdmin),
        isOnboarded: Boolean(user.isOnboarded),
        college: user.college,
        preferences: user.isOnboarded
          ? {
              lookingFor: "friendship",
              ageRange: {
                min: user.preferredAgeMin || 18,
                max: user.preferredAgeMax || 30,
              },
              distance: user.preferredDistance || 50,
              genderPreference:
                genderPreferenceMap[user.preferredGender || "all"] ||
                "everyone",
            }
          : null,
      },
    };
  },
};
