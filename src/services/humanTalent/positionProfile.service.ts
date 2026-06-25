import prisma from "../../config/client.js";

export const getActivePositionProfilesService = async () => {
    const positionProfiles = await prisma.positionProfile.findMany({
        where: {
            isActive: true,
        },
        select: {
            id: true,
            code: true,
            name: true,
        }
    });

    return positionProfiles;
};