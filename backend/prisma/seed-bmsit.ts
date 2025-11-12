import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FAKE_NAMES = [
  "Arjun", "Priya", "Rahul", "Anjali", "Vikram",
  "Sneha", "Rohan", "Pooja", "Aditya", "Divya",
  "Karan", "Meera", "Siddharth", "Neha", "Varun",
  "Riya", "Amit", "Kavya", "Nikhil", "Ishita",
  "Aarav", "Ananya", "Dev", "Tanvi", "Yash",
  "Shreya", "Harsh", "Naina", "Aakash", "Sakshi"
];

const INTERESTS = [
  "Photography", "Traveling", "Music", "Reading", "Gaming",
  "Fitness", "Cooking", "Art", "Dancing", "Movies",
  "Hiking", "Yoga", "Writing", "Sports", "Fashion",
  "Technology", "Food", "Coffee", "Dogs", "Cats"
];

const BIOS = [
  "Just a coffee enthusiast looking for adventure ☕",
  "Living life one playlist at a time 🎵",
  "Foodie | Traveler | Dog parent 🐕",
  "Here for meaningful connections and good vibes ✨",
  "Passionate about art and late-night conversations 🎨",
  "Fitness junkie with a sweet tooth 🏋️‍♀️🍰",
  "Part-time photographer, full-time dreamer 📸",
  "Netflix binger seeking someone to debate plot twists 🎬",
  "Aspiring chef looking for a taste tester 👨‍🍳",
  "Music lover who believes pineapple belongs on pizza 🍕",
  "Adventure seeker | Mountain lover | Coffee addict ⛰️",
  "Bookworm searching for my next chapter 📚",
  "Yoga instructor by day, stargazer by night 🧘‍♀️⭐",
  "Tech geek with a creative side 💻🎨",
  "Dance like nobody's watching, love like you've never been hurt 💃"
];

const PHOTO_URLS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400"
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Starting seed for BMSIT...");

  // Get BMSIT college
  const college = await prisma.college.findFirst({
    where: { name: "BMS Institute of Technology and Management" }
  });

  if (!college) {
    console.log("❌ BMSIT college not found!");
    return;
  }

  console.log(`✅ Found college: ${college.name}`);

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create 30 fake users
  const users = [];
  for (let i = 1; i <= 30; i++) {
    const name = FAKE_NAMES[i - 1] || `Student ${i}`;
    const gender = getRandomElement(["male", "female"]);
    const username = `bmsit${name.toLowerCase()}${i}`;
    
    const user = await prisma.user.create({
      data: {
        name: `${name}`,
        username,
        email: `bmsitfake${i}@bmsit.in`,
        password: hashedPassword,
        isOnboarded: true,
        bio: getRandomElement(BIOS),
        gender,
        interests: getRandomElements(INTERESTS, getRandomNumber(3, 6)),
        photos: getRandomElements(PHOTO_URLS, getRandomNumber(2, 4)),
        preferredAgeMin: 18,
        preferredAgeMax: 30,
        preferredGender: "all",
        collegeId: college.id
      }
    });
    users.push(user);
    console.log(`✅ Created: ${user.name} (@${user.username})`);
  }

  console.log(`\n🎉 Created ${users.length} fake users for BMSIT!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
