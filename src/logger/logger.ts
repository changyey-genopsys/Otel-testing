import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    targets: [{
      target: 'pino-pretty', // Send pretty logs to the console
      options: { colorize: true },
      level: 'info'
    },
    { target: './elastic.transport.ts' }
    ]
  },
});