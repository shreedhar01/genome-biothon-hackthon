export const healthService = {
  getHealthStatus: async () => {
    return {
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  },
};
