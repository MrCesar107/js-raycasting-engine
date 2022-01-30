const degreesToRadians = (degrees) => {
  const angle = degrees * (Math.PI / 180);
  return angle;
};

const distanceBetween = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const normalizeAngle = (angle) => {
  let normalizedAngle = angle % (2 * Math.PI);

  if (normalizedAngle < 0) {
    normalizedAngle += 2 * Math.PI;
  }

  return normalizedAngle;
};

export { degreesToRadians, distanceBetween, normalizeAngle };
