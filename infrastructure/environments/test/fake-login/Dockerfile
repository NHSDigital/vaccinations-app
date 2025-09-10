# Stage 1: Build the custom authenticator
FROM maven:3.8.4-openjdk-17 AS authenticator_builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package

# Use the official Keycloak image as the base
FROM quay.io/keycloak/keycloak:24.0.4 as builder

# Set environment variables for the build phase
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres

# Copy the custom authenticator .jar file into the providers directory
COPY --from=authenticator_builder /build/target/custom-authenticator.jar /opt/keycloak/providers/

# Copy the realm configuration files into the image
WORKDIR /opt/keycloak/data/import
COPY ./*realm.json .

# Run the Keycloak build/optimization step
RUN /opt/keycloak/bin/kc.sh build

# Create the final, optimized image
FROM quay.io/keycloak/keycloak:24.0.4

# Copy the optimized server and the custom provider from the builder stage
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy the realm configuration files again for the runtime
COPY --from=builder /opt/keycloak/data/import /opt/keycloak/data/import

# Set the entrypoint to start Keycloak
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
