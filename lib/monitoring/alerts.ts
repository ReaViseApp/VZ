interface AlertPayload {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  metadata?: Record<string, any>;
}

export async function sendAlert(payload: AlertPayload) {
  const promises: Promise<any>[] = [];

  // Slack webhook
  if (process.env.SLACK_WEBHOOK_URL) {
    promises.push(sendSlackAlert(payload));
  }

  // Discord webhook
  if (process.env.DISCORD_WEBHOOK_URL) {
    promises.push(sendDiscordAlert(payload));
  }

  // Email (future implementation)
  // if (process.env.ALERT_EMAIL) {
  //   promises.push(sendEmailAlert(payload));
  // }

  await Promise.allSettled(promises);
}

async function sendSlackAlert(payload: AlertPayload) {
  const color = {
    info: '#36a64f',
    warning: '#ff9800',
    error: '#f44336',
    critical: '#9c27b0',
  }[payload.severity];

  const slackPayload = {
    attachments: [
      {
        color,
        title: payload.title,
        text: payload.message,
        fields: Object.entries(payload.metadata || {}).map(([key, value]) => ({
          title: key,
          value: String(value),
          short: true,
        })),
        footer: 'Viz. Platform Monitoring',
        ts: Math.floor(new Date(payload.timestamp).getTime() / 1000),
      },
    ],
  };

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackPayload),
  });
}

async function sendDiscordAlert(payload: AlertPayload) {
  const color = {
    info: 0x36a64f,
    warning: 0xff9800,
    error: 0xf44336,
    critical: 0x9c27b0,
  }[payload.severity];

  const discordPayload = {
    embeds: [
      {
        title: payload.title,
        description: payload.message,
        color,
        fields: Object.entries(payload.metadata || {}).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true,
        })),
        footer: {
          text: 'Viz. Platform Monitoring',
        },
        timestamp: payload.timestamp,
      },
    ],
  };

  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload),
  });
}

// Helper function for critical alerts
export async function sendCriticalAlert(title: string, message: string, metadata?: Record<string, any>) {
  await sendAlert({
    title,
    message,
    severity: 'critical',
    timestamp: new Date().toISOString(),
    metadata,
  });
}
