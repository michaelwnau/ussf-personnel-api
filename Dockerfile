# Uses the node base image with the latest LTS version
FROM node:18.16.0 AS builder
# Informs Docker that the container listens on the 
# specified network ports at runtime
EXPOSE 4000

# set to development so we can compile
ENV NODE_ENV=development

COPY spreadsheets/ app/spreadsheets/
COPY tsconfig.json package.json yarn.lock app/
COPY src/ app/src/

# Changes working directory to the new directory just created
WORKDIR /app

# Installs dependencies on container
RUN yarn install --frozen-lockfile
RUN yarn compile

# Command container will actually run when called
CMD ["node", "./dist/index.js"]

FROM node:18.16.0

# Production mode
ENV NODE_ENV=production

COPY --from=builder /app/dist/ /app/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Changes working directory to the new directory just created
WORKDIR /app

# Command container will actually run when called
CMD ["node", "./dist/index.js"]
