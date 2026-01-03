/**
 * Generate a unique order number
 * Format: ORD + YYYYMMDD + random 6 digits
 * Example: ORD20241231123456
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  return `ORD${year}${month}${day}${random}`;
}

/**
 * Generate a unique chat room ID
 * Format: CHAT + timestamp + random 4 digits
 */
export function generateChatRoomId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `CHAT${timestamp}${random}`.toUpperCase();
}

