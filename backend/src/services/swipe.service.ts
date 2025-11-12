import { PrismaClient, SwipeType } from "@prisma/client";

const prisma = new PrismaClient();

export const swipeService = {
  /**
   * Create a swipe and check for match
   */
  async createSwipe(swiperId: string, swipedId: string, type: SwipeType) {
    // Prevent self-swipe
    if (swiperId === swipedId) {
      throw new Error("Cannot swipe on yourself");
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: {
          swiperId,
          swipedId
        }
      }
    });

    if (existingSwipe) {
      throw new Error("Already swiped on this user");
    }

    // Create the swipe
    const swipe = await prisma.swipe.create({
      data: {
        swiperId,
        swipedId,
        type
      }
    });

    let match = null;

    // Check for match only if it's a RIGHT or UP swipe
    if (type === "RIGHT" || type === "UP") {
      // Check if the other user has also swiped RIGHT/UP on this user
      const reciprocalSwipe = await prisma.swipe.findFirst({
        where: {
          swiperId: swipedId,
          swipedId: swiperId,
          type: { in: ["RIGHT", "UP"] }
        }
      });

      if (reciprocalSwipe) {
        // Check if match already exists
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { user1Id: swiperId, user2Id: swipedId },
              { user1Id: swipedId, user2Id: swiperId }
            ]
          }
        });

        // Create match if doesn't exist
        if (!existingMatch) {
          match = await prisma.match.create({
            data: {
              user1Id: swiperId,
              user2Id: swipedId
            },
            include: {
              user1: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  photos: true
                }
              },
              user2: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  photos: true
                }
              }
            }
          });
        }
      }
    }

    return {
      swipe,
      matched: !!match,
      match
    };
  },

  /**
   * Get all matches for a user
   */
  async getMatches(userId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            photos: true,
            interests: true,
            college: {
              select: {
                name: true
              }
            }
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            photos: true,
            interests: true,
            college: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Transform to return the "other" user in each match
    return matches.map(match => ({
      id: match.id,
      matchedAt: match.createdAt,
      user: match.user1Id === userId ? match.user2 : match.user1
    }));
  }
};
