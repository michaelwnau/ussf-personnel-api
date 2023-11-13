# Uses the node base image with the latest LTS version
FROM node:18.16.0-bullseye-slim AS builder
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

ARG BUILD
ENV BUILD_ID=${BUILD}

# Command container will actually run when called
CMD ["node", "./dist/index.js"]

FROM gcr.io/distroless/nodejs18-debian11

# Production mode
ENV NODE_ENV=production

COPY --from=builder /app/dist/ /app/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Changes working directory to the new directory just created
WORKDIR /app

ARG BUILD
ENV BUILD_ID=${BUILD}

# Command container will actually run when called
CMD ["./dist/index.js"]
