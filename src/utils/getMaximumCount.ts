export default function getMaximumCount(
  role,
  premium,
  user,
  defaultAmount,
): number {
  switch (role) {
    case 'admin':
      return Number.POSITIVE_INFINITY;
    case 'premium':
      return premium;
    case 'user':
      return user;
    default:
      return defaultAmount;
  }
}
