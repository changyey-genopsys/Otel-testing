import pino from "pino";

export interface LoggerOptions {
  serviceName: string;
}

export function createLogger(options: LoggerOptions) {

  return pino({
    level: "info",
    base: {
      "service.name": options.serviceName,
    },

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
}

// export const logger = pino({
//   level: "info",
//   transport: {
//     targets: [{
//       target: 'pino-pretty', // Send pretty logs to the console
//       options: { colorize: true },
//       level: 'info'
//     },
//     { target: './elastic.transport.ts' }
//     ]
//   },
// });