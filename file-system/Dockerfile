# 1️⃣ Stage 1: Base image
FROM node:18-alpine AS base

# 2️⃣ Đặt thư mục làm việc
WORKDIR /app

# 3️⃣ Copy package.json và package-lock.json để cài dependencies trước
COPY package.json package-lock.json ./

# 4️⃣ Cài đặt dependencies
RUN npm install --frozen-lockfile

# 5️⃣ Copy toàn bộ mã nguồn vào container
COPY . .

# 6️⃣ Biên dịch ứng dụng
RUN npm run build

# 7️⃣ Stage 2: Production Image
FROM node:18-alpine AS production

WORKDIR /app

# 8️⃣ Copy các file cần thiết từ stage trước
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.env ./

# 9️⃣ Cài đặt production dependencies & tạo Prisma Client
RUN npm install --production --frozen-lockfile


# 🔟 Chạy Prisma Generate trước khi ứng dụng start
RUN npx prisma generate

# 🔥 Expose port của ứng dụng
EXPOSE 3000

# 🚀 Chạy Prisma Migrate + Start App
CMD npx prisma migrate deploy && node dist/main
