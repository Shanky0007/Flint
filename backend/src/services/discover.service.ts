import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const discoverService = {
  /**
   * Get users for discovery feed
   * Excludes: self, already swiped, already matched
   */
  async getDiscoverFeed(userId: string, limit: number = 20) {
    // Get all user IDs that current user has already swiped on
    const swipedUserIds = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { swipedId: true }
    });

    const swipedIds = swipedUserIds.map(s => s.swipedId);

    // Get all user IDs that current user is matched with
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      select: { user1Id: true, user2Id: true }
    });

    const matchedIds = matches.map(m => 
      m.user1Id === userId ? m.user2Id : m.user1Id
    );

    // Combine all IDs to exclude (self + swiped + matched)
    const excludeIds = [userId, ...swipedIds, ...matchedIds];

    // Get current user's preferences
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        collegeId: true,
        preferredGender: true,
        preferredAgeMin: true,
        preferredAgeMax: true
      }
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Build gender filter
    const genderFilter = currentUser.preferredGender === "all" 
      ? {} 
      : { gender: currentUser.preferredGender };

    // Fetch users
    const users = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        collegeId: currentUser.collegeId, // Same college only
        isOnboarded: true,
        ...genderFilter
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        gender: true,
        interests: true,
        photos: true,
        college: {
          select: {
            name: true,
            location: true
          }
        },
        createdAt: true
      },
      take: limit,
      orderBy: {
        createdAt: "desc" // Newest users first
      }
    });

    return users;
  }
};
