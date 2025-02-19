# 1. Use the official Node.js 18 image as the base
FROM node:18-alpine AS base

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install --frozen-lockfile

# 5. Copy all project files to the container
COPY . .

# 6. Build the Next.js application
# 6. Build the Next.js application (bỏ qua lỗi TypeScript)
RUN npm run build

# 7. Use a lightweight image for production
FROM node:18-alpine AS production

# 8. Set the working directory
WORKDIR /app

# 9. Copy only the necessary files for production
COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# 10. Install only production dependencies
RUN npm install --production --frozen-lockfile

# 11. Expose the application port
EXPOSE 3001

# 12. Set environment variables
ENV NODE_ENV=production

# 13. Start the Next.js application
CMD ["npm", "start"]